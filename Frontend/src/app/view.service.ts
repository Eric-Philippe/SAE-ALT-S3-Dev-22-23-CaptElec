import { Injectable } from "@angular/core";
import { Chart } from "chart.js";
import { Subject } from "rxjs";
import { Gauge } from "./gauge/gauge.model";

const views = [
  "Log",
  "Dashboard",
  "Notifications",
  "Administration",
  "Projects",
  "Help",
  "Create Account",
];

@Injectable({
  providedIn: "root",
})
export class ViewService {
  // view = "Log";
  view = "Dashboard";
  dashboardId = "";
  isDashboardActive = false;
  observableDash$ = new Subject();
  observableGauge$: Subject<Gauge> = new Subject();
  charts: Chart[] = [];
  batteryChart!: Chart;
  pluginsCenterText: any[] = [];

  constructor() {}

  public setView(viewName: string): void {
    if (!views.includes(viewName)) throw new Error("Invalid view name");
    this.view = viewName;
    if(this.getView()==='Dashboard' && viewName==='Dashboard'){
      window.location.reload();
    }
  }

  public getView(): string {
    return this.view;
  }

  public setDashboardId(inputDashboardId: string): void {
    this.dashboardId = inputDashboardId;
    
  }

  public getDashboardId(): string {
    return this.dashboardId;
  }

  public getIsDashboardActive(): boolean{
    return this.isDashboardActive;
  }

  public setIsDashboardActive(bool: boolean){
    this.isDashboardActive = bool;
  }
}
