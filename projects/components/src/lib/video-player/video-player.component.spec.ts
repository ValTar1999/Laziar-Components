import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayer } from './video-player.component';

describe('VideoPlayer', () => {
  let fixture: ComponentFixture<VideoPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayer],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPlayer);
    fixture.detectChanges();
  });

  it('should show a fallback when there is no source or Video.js', () => {
    expect(fixture.nativeElement.querySelector('.lz-video-player__fallback')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('video')).toBeNull();
  });
});
