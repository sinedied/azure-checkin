import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event',
  template: `<section></section>
    ID: {{ id }} `,
  styles: [],
})
export class EventComponent implements OnInit {
  id?: string = undefined;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (!id) {
      this.router.navigate(['']);
    }
  }
}
