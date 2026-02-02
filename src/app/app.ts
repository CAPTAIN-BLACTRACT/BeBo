import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';

interface Track{
  name: string;
  soundFile : string;
  color:string;
  steps:boolean[];
  audio:HTMLAudioElement;

}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  bpm = signal(120);
  isPlaying = signal(false);
  currentStep = signal(0);
  timer: any;

  tooglePlay(){
    this.isPlaying.update(v=>!v);

    if(this.isPlaying()){
      this.startEngine();
    }
    else{
      this.stopEngine();
    }
  }
  startEngine(){
    const intervalTime = (60/this.bpm())/4 *1000;

    this.timer = setInterval(()=>{
      this.currentStep.update(s=>(s+1)%16);
      this.playCurrentStep();
    }, intervalTime);
  }

  stopEngine(){
    clearInterval(this.timer);
    this.currentStep.set(0);
  }

  playCurrentStep(){
    const step= this.currentStep();

    this.tracks().forEach(track => {
      if(track.steps[step]){
        track.audio.currentTime=0;
        track.audio.play();
      }

    });
  }

  updateBpm(newBpm:number){
    this.bpm.set(newBpm);
    if(this.isPlaying()){
      this.stopEngine();

      this.isPlaying.set(true);
      this.startEngine();
    }
  }

  clearGrid(){
    this.tracks.update(tracks=>
      tracks.map(t=>({...t,steps:Array(16).fill(false)}))
    );

    this.stopEngine();
    this.isPlaying.set(false);
  }
  tracks= signal<Track[]>([
    {
      name: 'Kick',
      soundFile: 'https://cdn.jsdelivr.net/gh/Tonejs/audio/drum-samples/CR78/kick.mp3',
      color: '#ef4444',
      steps: Array(16).fill(false),
      audio:new Audio('https://cdn.jsdelivr.net/gh/Tonejs/audio/drum-samples/CR78/kick.mp3')
    },
    {
      name: 'Snare',
      soundFile: 'https://cdn.jsdelivr.net/gh/Tonejs/audio/drum-samples/CR78/snare.mp3',
      color: '#3b82f6',
      steps: Array(16).fill(false),
      audio: new Audio('https://cdn.jsdelivr.net/gh/Tonejs/audio/drum-samples/CR78/snare.mp3')
    },
    {
      name: 'HitHat',
      soundFile:'https://cdn.jsdelivr.net/gh/Tonejs/audio/drum-samples/CR78/hihat.mp3',
      color: '#eab308',
      steps: Array(16).fill(false),
      audio: new Audio('https://cdn.jsdelivr.net/gh/Tonejs/audio/drum-samples/CR78/hihat.mp3')
    },
    {
      name: 'Clap',
      soundFile: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
      color: '#a855f7',
      steps: Array(16).fill(false),
      audio: new Audio('https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3')
    }
  ]);

  toogleStep(trackIndex:number,stepIndex:number){
    this.tracks.update(currentTracks=>{
      const newTracks = [...currentTracks];

      newTracks[trackIndex].steps[stepIndex] = !newTracks[trackIndex].steps[stepIndex];
      return newTracks;
    });
  }
}
