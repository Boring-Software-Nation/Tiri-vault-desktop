import Dexie from 'dexie';

export type AddressbookEntry = {
  id?: number;
  address: string;
  datetime: string;
  name?: string | null;
};

export class AddressbookDB {
  db: Dexie;
  constructor() {
    this.db = new Dexie('addressbookDB');

    this.db.version(1).stores({
      recent: 'address, datetime',
      addressbook: 'address, name',
    });
  }
  addRecent(address: string) {
    return this.db.table('recent').put({ address, datetime: new Date().toISOString() }, address);
  }
  getRecents(): Promise<AddressbookEntry[]> {
    return this.db.table('recent').orderBy('datetime').reverse().toArray()
      .then(recents => Promise.all(
        recents.map(async recent => {
          const addressbookEntry = await this.db.table('addressbook').get({ address: recent.address });
          return {
            ...recent,
            name: addressbookEntry ? addressbookEntry.name : null,
          };
        })
      ));
  }
  getAddressbook(): Promise<AddressbookEntry[]> {
    return this.db.table('addressbook').orderBy('name').toArray();
  }
  addAddress(address: string, name: string) {
    return this.db.table('addressbook').put({ address, name }, address);
  }
}

const addressbookDb = new AddressbookDB();
export default addressbookDb;
