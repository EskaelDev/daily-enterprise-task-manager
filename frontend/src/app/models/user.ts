import {IUser} from './iuser';
import {Language} from './language.enum';
import {Role} from './role.enum';

export class User implements IUser {
  login: string;
  password?: string;
  userRole: Role;
  userName: string;
  surname: string;
  userLanguage: Language;
  token: string;

  static prepareToUpdate(user: User) {
    return new User({
      login: user.login,
      password: user.password,
      userRole: user.userRole,
      userName: user.userName,
      surname: user.surname,
      userLanguage: user.userLanguage,
      token: user.token,
    });
  }

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
