import iconv from "iconv-lite";
import encodings from "iconv-lite/encodings";
iconv.encodings = encodings;
import MockExpressResponse from "mock-express-response";

import { successResponse } from "../../helpers";

describe("Report Controller", () => {
  it("should pass this test", () => {
    expect(true).toBe(true);
  });
});