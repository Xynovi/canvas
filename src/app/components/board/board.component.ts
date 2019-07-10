import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { viewClassName } from "@angular/compiler";
import { fromEvent } from "rxjs";
import { switchMap, takeUntil, pairwise } from "rxjs/operators";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements AfterViewInit {
  @ViewChild("canvas", { static: false }) public canvas: ElementRef;
  @ViewChild("canvasWrapper", { static: false })
  public canvasWrapper: ElementRef;

  @Input() public width;
  @Input() public height;

  buttonPadding: string = "12px";
  buttonText: string = "O";
  sidebarActive: boolean;

  protected ctx: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const canvasWrapperEl: HTMLDivElement = this.canvasWrapper.nativeElement;

    this.ctx = canvasEl.getContext("2d");

    this.width = canvasWrapperEl.offsetWidth;
    this.height = canvasWrapperEl.offsetHeight;

    canvasEl.height = this.height;
    canvasEl.width = this.width;

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "#000";

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // captures all mousedown events from canvas
    fromEvent(canvasEl, "mousedown")
      .pipe(
        switchMap(e => {
          // after a mouse down, records the mouse moves
          return fromEvent(canvasEl, "mousemove").pipe(
            // stop one the user releases the mouse
            takeUntil(fromEvent(canvasEl, "mouseup")),
            // stop once the mouse leaves the canvas
            takeUntil(fromEvent(canvasEl, "mouseleave")),
            // gets the previous value to draw a line
            // from the previous point to current point
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.ctx) {
      return;
    }

    this.ctx.beginPath();

    if (prevPos) {
      this.ctx.moveTo(prevPos.x, prevPos.y); // from
      this.ctx.lineTo(currentPos.x, currentPos.y);
      this.ctx.stroke();
    }
  }

  sidebarToggle(): void {
    if (this.sidebarActive) {
      console.log("false");
      // closes the sidebar
      this.sidebarActive = false;
      this.buttonText = "O";
      this.buttonPadding = "12px";
    } else {
      console.log("true");
      // opens the sidebar
      this.sidebarActive = true;
      this.buttonText = "X";
      this.buttonPadding = "192px";
    }
  }

  clearCanvas(): void {
    // Store the current transformation matrix
    console.log("in clear");
    this.ctx.save();

    // Use the identity matrix while clearing the canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Restore the transform
    this.ctx.restore();
  }
}
