import { createConnection, Connection } from "typeorm";

const connectPostgreSQL = async () => {
  const conn = await createConnection();
};

export default connectPostgreSQL;
