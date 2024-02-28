import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "users" })
export default class User {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: "email", nullable: false, unique: true })
  email!: string;

  @Property({ fieldName: "password", nullable: false })
  password!: string;
}
