import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  sql,
} from "@mikro-orm/core";
import User from "./User.model.js";
import { Decimal } from "decimal.js";

@Entity({ tableName: "transactions" })
export default class Transaction {
  @PrimaryKey()
  id!: number;

  @Property({
    columnType: "NUMERIC(6,2)",
    fieldName: "amount",
    nullable: false,
    type: () => Decimal,
  })
  amount!: Decimal;

  @Property({ nullable: false, default: sql.now(), fieldName: "created_at" })
  createdAt!: Date;

  @ManyToOne(() => User, { ref: true, fieldName: "user_id" })
  user!: Ref<User>;
}
