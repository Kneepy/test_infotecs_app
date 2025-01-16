import {Component, inject, OnInit} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    standalone: true,
    imports: [
        RouterOutlet,
    ],
})
export class AppComponent implements OnInit {
    private readonly titleService= inject(Title);

    ngOnInit() {
        this.setMetaTags()
    }

    setMetaTags() {
        this.titleService.setTitle("Test Infotex App");
    }
}
