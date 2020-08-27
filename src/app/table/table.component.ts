import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { TableStore } from './table.store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'table-root',
  templateUrl: './table.component.html',
  styleUrls: ['./styles/table.component.css'],
  providers: [ TableStore ]
})

export class TableComponent implements OnInit, OnDestroy {

  constructor(
    private readonly tableStore: TableStore,
    public renderer: Renderer2
    ) {};
  
  //the results array is simply our table data
  results = [];
  //the keys array is used for determining our dragged column arrangement (see sorting logic below)
  keys = [];
  resReady = false;
  storage = window.localStorage;
  postsSub = null;

  ngOnInit() {
    //checks if table data is already in localStorage and loads from there if so
    if (this.checkStorage('results') === 1) {
      const widthEstimate = document.body.clientWidth / 5;

      this.results = JSON.parse(this.storage.getItem('results'));

      if (this.checkStorage('keys') === 1) {
        this.keys = JSON.parse(this.storage.getItem('keys'));
      } else {
        this.keys = Object.keys(this.results[0]);
        this.storage.setItem('keys', JSON.stringify(this.keys));     
      };

      this.columnWidths = Array(this.keys.length).fill(widthEstimate);

      if (this.checkStorage('descending') === 1) {
        this.descending = this.storage.getItem('descending') === 'true' ? true : false;    
      };

      if (this.checkStorage('sortIndicator') === 1) {
        this.sortIndicator = parseInt(this.storage.getItem('sortIndicator'));
      };

      this.tableStore.setState({posts: [...this.results]});

      this.resReady = true;

      if (this.checkStorage('searchQuery') === 1) {
        this.searchQuery = this.storage.getItem('searchQuery');
        const rows = Array.from(document.querySelectorAll('.table-list'));
        this.searchFilter(rows, this.searchQuery);
      };

    } else {
      this.tableStore.setState({posts: []});
      this.tableStore.fetchPosts();  
    };
  };

  ngOnDestroy() {
    if (this.postsSub === null) return;
    return this.postsSub.unsubscribe();
  };

  checkStorage(item) {
    if (this.storage.getItem(item) !== null) return 1;
  };

  clearStorage() {
    this.storage.clear();
    location.reload();
  };

  loadPosts() {
    const widthEstimate = document.body.clientWidth / 5;

    this.postsSub = this.tableStore.posts$.subscribe(
      posts => this.results = posts
    );
    this.results = this.results.flat();
    this.storage.setItem('results', JSON.stringify(this.results)); 

    this.keys = Object.keys(this.results[0]);
    this.storage.setItem('keys', JSON.stringify(this.keys)); 

    this.columnWidths = Array(this.keys.length).fill(widthEstimate);

    this.resReady = true;
    console.log(this.postsSub)
  };

  //sorting logic

  descending = true;
  sortIndicator = 0;

  columnSorting(event, i) {
    const sortTarget = event.target.text;
    event.preventDefault();

    this.sortIndicator !== i ? this.descending = true : this.descending = !this.descending;
    this.sortIndicator = i;
    this.stringSorter(this.results, sortTarget, this.descending);
    
    this.storage.setItem('results', JSON.stringify(this.results));
    this.storage.setItem('descending', this.descending.toString()); 
    this.storage.setItem('sortIndicator', this.sortIndicator.toString()); 
  };

  stringSorter(arr, target, order) {
    if (order) {
      arr.sort((a, b) => {
        return (a[target] < b[target]) ? -1 : (a[target] > b[target]) ? 1 : 0;
      });
    } else {
      arr.sort((a, b) => {
        return (a[target] > b[target]) ? -1 : (a[target] < b[target]) ? 1 : 0;
      });
    };
  };

  //rearranging logic

  drop(event: CdkDragDrop<string[]>) {
    this.moveItemInArrayCustom(this.keys, event.previousIndex, event.currentIndex);
    this.storage.setItem('keys', JSON.stringify(this.keys)); 
  };

  moveItemInArrayCustom(arr, startIdx, endIdx) {
    const startPos = this.arrayBound(startIdx, arr.length - 1);
    const endPos = this.arrayBound(endIdx, arr.length - 1);

    if (startPos === endPos) {
      return;
    };

    const target = arr[startPos];
    const diff = endPos < startPos ? -1 : 1;

    for (let i = startPos; i !== endPos; i += diff) {
      arr[i] = arr[i + diff];
    };

    arr[endPos] = target;

    //this check lets the sorting indicator stay with its column if it's moved
    if (startIdx === this.sortIndicator) {
      this.sortIndicator = endIdx;
      this.storage.setItem('sortIndicator', this.sortIndicator.toString()); 
    } else if (endIdx === this.sortIndicator) {
      this.sortIndicator = startIdx;
      this.storage.setItem('sortIndicator', this.sortIndicator.toString()); 
    };
  };

  arrayBound(value, max) {
    return Math.max(0, Math.min(max, value));
  };

  //resizing logic
  
  pressed = false;
  startingX
  startingWidth
  columnWidths = [];
  resizableFnMousemove: () => void;
  resizableFnMouseup: () => void;

  resizeColumn(event, column) {
    const target = event.target;
    this.pressed = true;
    this.startingX = event.pageX;
    this.startingWidth = target.clientWidth;
    const test: HTMLElement = document.querySelector('.table')
    this.mouseMove(column);
  };

  mouseMove(column) {
    this.resizableFnMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed) {
        let width = this.startingWidth + (event.pageX - this.startingX);
        this.columnWidths[column] = width;
      };
    });
    this.resizableFnMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.resizableFnMousemove();
        this.resizableFnMouseup();
      };
    });
  };

  //searching logic

  searchQuery

  searchFilterHandler(event) {
    const rows = Array.from(document.querySelectorAll('.table-list'));
    const searchTerm = event.target.value.toLowerCase();
    this.searchQuery = searchTerm;
    this.storage.setItem('searchQuery', this.searchQuery); 

    this.searchFilter(rows, searchTerm);
  };

  searchFilter(arr, searchTerm) {
    arr.forEach(row => {
      const cells: Array<HTMLElement> = Array.from(row.querySelectorAll('.table-box'));
      row.classList.add('hideMe')
      
      cells.forEach(cell => {
        if (cell.innerText.toLowerCase().indexOf(searchTerm) > -1) {
          row.classList.remove('hideMe');
        };
      });
    });
  };
};
