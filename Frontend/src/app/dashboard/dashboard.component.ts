import { Component, ViewChild, QueryList, ElementRef } from "@angular/core";

import SVGService from "../modules/SVG";

import File from "../modules/File";
import { ViewService } from "../view.service";
import { RoomService } from "../room.service";
import { Room } from "../room";
import { HttpErrorResponse } from "@angular/common/http";
import { Chart, registerables } from "chart.js";
import { Gauge } from "../gauge/gauge.model";

Chart.register(...registerables);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  @ViewChild("svg") svg: ElementRef | null = null;

  svgFiles: File[] = [];
  viewService!: ViewService;
  roomService!: RoomService;
  rooms!: Room[];
  roomName!: string;
  co2Chart!: Gauge;
  humidityChart!: Gauge;
  temperatureChart!: Gauge;

  constructor(private svgService: SVGService, private viewServ: ViewService, private roomServ: RoomService) { }

  async ngOnInit() {
    this.co2Chart = new Gauge("co2Chart","#3f1ee6");
    this.humidityChart = new Gauge("humidityChart", "#8338ec");
    this.temperatureChart = new Gauge("temperatureChart", "#e63946");

    this.viewService = this.viewServ;
    this.roomService = this.roomServ;
    this.getRoomInformations();

    let values = await this.svgService.getSVGFromClientProject(
      "Rémy",
      "Boulle",
      "0acf456wf",
      "IUT_BLAGNAC"
    );

    values.forEach((files: File) => {
      files.displayOnPage();
    });
  }

  ngAfterViewInit() {

    let svgContainer = document.getElementById("svg-container");
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          let groups = mutation.addedNodes;
          groups.forEach((group: Node, index: number, parent: NodeList) => {
            if (group instanceof Element && group.tagName === "DIV") {
              let gs = group.querySelectorAll("g");
              gs.forEach((group: Node, index: number, parent: NodeList) => {
                group.addEventListener("mouseenter", (g) => {
                  console.log("enter");
                  if (group instanceof Element) {
                    let path = group.querySelectorAll("path");
                    // If the path is already red, we remove the red color
                    for (let i = 0; i < path.length; i++) {
                      if (path[i].getAttribute("style")?.includes("fill:red")) {
                        path[i].setAttribute("style", "fill:none");
                      } else {
                        path[i].setAttribute("style", "fill:red");
                      }
                    }
                  }
                });
                group.addEventListener("mouseleave", (g) => {
                  console.log("enter");
                  if (group instanceof Element) {
                    let path = group.querySelectorAll("path");
                    // If the path is already red, we remove the red color
                    for (let i = 0; i < path.length; i++) {
                      if (path[i].getAttribute("style")?.includes("fill:red")) {
                        path[i].setAttribute("style", "fill:none");
                      } else {
                        path[i].setAttribute("style", "fill:red");
                      }
                    }
                  }
                });
              });
            }
          });
        }
      });
    });
    if (!svgContainer) throw new Error("Container not found");
    observer.observe(svgContainer, { childList: true });
  }

  getRoomInformations(): void {
    this.roomService.getRoom("AM107-33").subscribe(
      (result: Room[]) => {
        this.rooms = result;
        this.roomName = this.rooms[0].devicename;
      },
      (error: HttpErrorResponse) => {
        console.log(error);

      }
    )
  }

}
