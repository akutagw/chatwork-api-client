import ChatworkApi from ".";
import * as fs from "fs";
import * as path from "path";

const API_TOKEN_PATH = path.resolve(__dirname, "../API_TOKEN");

const API_TOKEN = getApiToken();

test("API Token", () => {
  expect(API_TOKEN).toMatch(/^[a-z0-9]+$/);
});

test("API Connection", async () => {
  const api = new ChatworkApi(API_TOKEN);

  const rooms = await api.getRooms();
  expect(Array.isArray(rooms)).toBeTruthy();
  expect(rooms.length).toBeGreaterThanOrEqual(1);

  const myRoom = rooms.find((room: any) => room.type === "my");
  expect(myRoom).toBeDefined();
  expect(myRoom).toHaveProperty("room_id");
  const { room_id } = myRoom;

  const message = await api.postRoomsMessages(room_id, {
    body: "[info][title]chatwork-api-client[/title]test[/info]"
  });
  expect(message).toHaveProperty("message_id");
  const { message_id } = message;

  const deleteResult = await api.deleteRoomsMessagesInfo(room_id, message_id);
  expect(deleteResult).toHaveProperty("message_id");
});

function getApiToken() {
  if (!fs.existsSync(API_TOKEN_PATH)) {
    throw new Error(
      ['The file "API_TOKEN" is not found.', API_TOKEN_PATH].join("\n")
    );
  }
  return fs
    .readFileSync(API_TOKEN_PATH, {
      encoding: "utf8"
    })
    .split("\n")
    .filter(line => line && !line.startsWith("#"))
    .join("");
}
