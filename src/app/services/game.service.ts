import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IPlayer } from '../interfaces/IPlayer';
import { IGame } from '../interfaces/IGame';

@Injectable()
export class GameService {

  private gamesCollection: AngularFirestoreCollection<IGame>;
  private gameDoc: AngularFirestoreDocument<IGame>;
  private game$: Observable<IGame>;

  constructor(private afs: AngularFirestore) {
    this.gamesCollection = this.afs.collection('games');
  }

  gamesSnapshotChanges() {
    return this.gamesCollection.snapshotChanges();
  }

  gamesValueChanges() {
    return this.gamesCollection.valueChanges();
  }

  addGame(user: IPlayer): Promise<firebase.firestore.DocumentReference> {
    const game = this.createGame(user);
    return this.gamesCollection.add(game);
  }

  findOpenGameId(): Observable<string> {
    const gamesCollection = this.afs.collection('games', ref => ref.where('hasStarted', '==', false).limit(1));
    return gamesCollection.snapshotChanges()
      .take(1)
      .map(actions => {
        const ids = actions.map(a => a.payload.doc.id);
        return ids[0];
      });
  }

  getGameById(id: string): Observable<IGame> {
    this.gameDoc = this.afs.doc<IGame>(`games/${id}`);
    this.game$ = this.gameDoc.valueChanges();
    return this.game$;
  }

  updateGame(game: IGame): Promise<void> {
    return this.gameDoc.update(game);
  }

  private createGame(player: IPlayer): IGame {
    player.isHost = true;
    return {
      hasStarted: false,
      players: [player],
      turn: 0
    }
  }
}
