import { getMessage } from "./message";

test("message", () => {
  expect(getMessage()).toBe("Hello");
});
