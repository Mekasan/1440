import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, SortDirection } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Event, TableService } from './table.service';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, switchMap, of as observableOf, map, catchError, Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
export interface ApiSearchRequest {
  order: string;
  include: string[];
  keys: string[];
  limit: number;
  skip: number;
  where: {
    eventType: {}
    isCancelled: {}
    searchWords?: {}
  }
}
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit{
  displayedColumns = ['title','date', 'createdAt', 'eventType', 'owner'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  title = '1440';
  tableWidth = 90;
  request: ApiSearchRequest = {
    "order": "-createdAt",
    "include" : ["owner.profilePictures", "links"],
    "keys": ["title", "owner.profileName", "date", "createdAt", "eventType"],
    "limit" : 50,
    "skip": 0,
    "where": {
      "eventType": {"$in": [0, 1, 2]},
      "isCancelled": {"$ne": true},
    }
  }
  sortBy = this.request.order.replace('-', '').trim();
  direction!: 'asc' | 'desc' | SortDirection;
  filterForm: FormControl = new FormControl();
  ELEMENT_DATA: Event[] = [];
  isLoadingResults = true;
  subscription!: Subscription | null;
  constructor(
      breakpointObserver: BreakpointObserver,
      private table: TableService,
  ) {
    breakpointObserver.observe([
      Breakpoints.Large,
    ]).subscribe(result => {
      if (result.matches) {
        this.tableWidth = 70;
      } else {
        this.tableWidth = 90;
      }
    });
  }

  ngOnInit() {
    const regExp = RegExp('(-)');
    const result = regExp.exec(this.request.order);
    this.direction = (result ? 'asc': 'desc');
    this.subscribeOnChanges();
  }

  subscribeOnChanges() {
    this.filterForm.valueChanges
        .pipe(debounceTime(400), untilDestroyed(this))
        .subscribe(data => {
          let value = data.trim();
          value = value.toLowerCase();
          if (value && value !== '') {
            this.request.where = Object.assign({}, this.request.where, {searchWords: {"$text":{"$search": {"$term": value}}}});
            this.table.getData(this.request).subscribe((data: Event[]) => {
              this.dataSource = new MatTableDataSource(data);
            })
          } else { // if input empty delete from request
            delete this.request.where['searchWords'];
          }
        })
  }

  ngAfterViewInit() {
    this.table.getData(this.request)
        .pipe(untilDestroyed(this))
        .subscribe((data: Event[]) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.sort.start = this.direction;
          this.sort.sort(<MatSortable>{id: this.sort.active, start: this.direction});
          this.sort.sortChange
              .pipe(
                  untilDestroyed(this),
                  startWith({}),
                  switchMap(() => {
                    this.isLoadingResults = true;
                    this.sortChanged(this.sort.direction ? this.sort.direction: this.direction, this.sort.active);
                    this.pageChanged(this.paginator.pageIndex);
                    if (!this.subscription) {
                      return this.table!.getData(
                          this.request
                      ).pipe(catchError(() => observableOf(null)));
                    }
                    this.subscription.unsubscribe();
                    this.subscription = null;
                    return observableOf(null);
                  }),
                  map(data => {
                    if (data === null) {
                      return [];
                    }
                    return data;
                  }),
              )
              .subscribe(data => (data && data.length ? this.dataSource = new MatTableDataSource(data): ''));
        });
  }
  sortChanged(dn: SortDirection, active:string ) {
    this.direction = dn;
    const direction = this.direction === 'asc'? '-' : '';
    this.request.order = direction + active;
  }

  pageChanged(page: number) {
    this.request.skip = page * this.request.limit;
  }
  pageEvent(e: any) {
    this.pageChanged(e.pageIndex);
    this.table.getData(this.request)
        .pipe(untilDestroyed(this))
        .subscribe(data => {
      this.dataSource = new MatTableDataSource(data)
    });
  }
}



