import iconv from "iconv-lite";
import encodings from "iconv-lite/encodings";
iconv.encodings = encodings;
import { healthCheck } from "./user.controller";
import { successResponse, errorResponse } from "../../helpers";
import { User } from "../../models";

// mock success and error functions
jest.mock("./../../helpers");

describe("healthCheck", () => {
  // test('should return success response with "working" message', async () => {
  //   const req = {};
  //   const res = {
  //     json: jest.fn(),
  //     status: jest.fn().mockReturnThis(),
  //   };

  //   successResponse.mockImplementation((req, res, data) => {
  //     res.status(200).json(data);
  //   });

  //   // Call the healthCheck function
  //   await healthCheck(req, res);

  //   // Check if the response is as expected
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({ message: "working" });
  // });

  test("should return error response with error message", async () => {
    // Mock the request and response objects
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Mock the errorResponse function
    // jest.mock("../../helpers"); // Make sure to provide the correct path to the errorResponse module
    // const { errorResponse } = require("../path/to/errorResponse"); // Import the errorResponse function

    errorResponse.mockImplementation((req, res, errorMessage) => {
      res.status(500).json({ message: errorMessage });
    });

    // Throw an error to simulate an error scenario
    const errorMessage = "An error occurred";
    const error = new Error(errorMessage);

    // Call the healthCheck function
    await healthCheck(req, res);

    // Check if the response is as expected
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
