import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})

export class GifsService {

private _tagsHistory:string[] = [];
private apiKey:string = 'kHVnBYmJf7Hp7TdB0swn3zH4OoVu0laW';
private serviceUrl:string = 'https://api.giphy.com/v1/gifs';
public gifsList:Gif[] = [];

constructor(private http:HttpClient) {
    this.loadLocalStorage();
 }

get tagsHistory(){
    return [...this._tagsHistory];
}


private organizeHistory(tag:string){
    tag = tag.toLowerCase();
    if(this._tagsHistory.includes(tag)){
        this._tagsHistory = this._tagsHistory.filter((oldtag) => oldtag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
}

saveLocalStorage(){
    localStorage.setItem('historial', JSON.stringify(this._tagsHistory));
}

loadLocalStorage():void{
    if(!localStorage.getItem('historial')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('historial')!);
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
}

async searchTag(tag:string):Promise<void>{

    if(tag.length === 0) return;
    this.organizeHistory(tag)

    const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params:params})
            .subscribe(resp => {
                this.gifsList = resp.data
                console.log({gifs:this.gifsList});
            });

    /*const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=kHVnBYmJf7Hp7TdB0swn3zH4OoVu0laW&q=valorant&limit=10')
    const data = await resp.json();
    console.log(data);*/

    //this._tagsHistory.unshift(tag);
    //console.log(this.tagsHistory);
}
    
}