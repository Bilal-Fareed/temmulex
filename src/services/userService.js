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

  const { email, title, first_name, last_name, country, dob, phone, password, profilePicture } = data

  const [user] = await db.insert(users)
    .values({ email: email, password: password, title: title, firstName: first_name, lastName: last_name, country: country, dob: dob, phone: phone, profilePicture: profilePicture })
    .returning({ uuid: users.uuid, phone: users.phone, email: users.email, firstName: users.firstName, lastName: users.lastName, country: users.country, dob: users.dob, profilePicture: users.profilePicture });

  return user;
};

const updateUserByUuidService = async (uuid, updatedObject) => {
  await db
    .update(users)
    .set(updatedObject)
    .where(eq(users.uuid, uuid));
};


export {
    createUserService,
    getUserByEmail,
    updateUserByUuidService,
    getUserByUuid,
}

