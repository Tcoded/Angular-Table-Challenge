import { RestAPIService } from './../restapi.service';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs/operators';
  
@Injectable()
export class TableStore extends ComponentStore<any> {

    constructor(private readonly restApiService: RestAPIService) {
        super();
    };

    readonly fetchPosts = this.effect((dumm$) => {
        return dumm$.pipe(
            switchMap(() => this.restApiService.getPosts().pipe(
                tap({
                    next: (res) => this.setState((state) => {
                        return {
                            ...state,
                            posts: [...state.posts, res]
                        };
                    })
                })
            ))
        );
    });

    readonly posts$ = this.select(state => state.posts);
};