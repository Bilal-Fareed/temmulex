import { db } from "../../infra/db.js";
import users from "../models/usersModel.js";

const getUserByEmail = async (email, options = {}) => {
    return await db.query.users.findFirst({
        where: eq(users.email, email),
    });
}

const getUserByUuid = async (uuid, options = {}) => {
    return await db.query.users.findFirst({
        where: eq(users.uuid, uuid),
    });
}

const createUserService = async (data, options = {}) => {

  const { email, title, first_name, last_name, country, dob, phone, password } = data

  const [user] = await db.insert(users)
    .values({ email: email, password: password, title: title, firstName: first_name, lastName: last_name, country: country, dob: dob, phone: phone })
    .returning({ uuid: users.uuid, phone: users.phone, email: users.email, firstName: users.firstName, lastName: users.lastName, country: users.country, dob: users.dob });

  return user;
};

const updateUserByUuidService = async (uuid, updatedObject) => {
  await db
    .update(users)
    .set(updatedObject)
    .where(eq(users.uuid, uuid));
};

const logoutService = async (userUuid) => {
    
    const user = await db().query.users.findFirst({
        where: eq(users.uuid, userUuid),
    });

    if (!user) throw new Error('User does not exist');

    await Promise.all([
        db().update(users).set({ refreshTokenVersion: user.refreshTokenVersion + 1 }).where(eq(users.uuid, userUuid)),
        db().delete(sessions).where(eq(sessions.userId, userUuid))
    ]); 
};


export {
    createUserService,
    getUserByEmail,
    updateUserByUuidService,
    getUserByUuid,
    logoutService,
}

