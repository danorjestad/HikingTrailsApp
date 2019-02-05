import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ViewBundleComponent } from './view-bundle/view-bundle.component';

import { BundleService } from './services/bundle.service';
import { PathService } from './services/path.service';
import { PlaceService } from './services/place.service';

@NgModule({
  declarations: [
    AppComponent,
    ViewBundleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [BundleService, PathService, PlaceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
