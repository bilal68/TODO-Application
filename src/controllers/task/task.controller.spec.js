// require('mysql2/node_modules/iconv-lite').encodingExists('foo');
import iconv from 'iconv-lite';
import encodings from 'iconv-lite/encodings';
iconv.encodings = encodings;
import MockExpressResponse from "mock-express-response";
import { healthCheck } from "./user.controller";

import { successResponse } from "../../helpers";

import { User } from "../../models";
// mock success and error function mock
jest.mock("./../../helpers");

// extress response object for (req, res) function
const res = new MockExpressResponse();

// describe('User controller', () => {
//   test('allUsers', async () => {
//     // mock database functions that we are using inside functions
//     // so we don't have to be dependant on database
//     // resolve data that you want return from database in Promise.resolve
//     const spyUserFindAndCountAll = jest
//       .spyOn(User, 'findAndCountAll')
//       .mockImplementation(() => Promise.resolve([]));

//     // create request object and put value that you required to check in function
//     const req = {
//       params: {
//         page: 1,
//       },
//     };

//     // call function
//     await allUsers(req, res);
//     // check database function is calling or not
//     expect(spyUserFindAndCountAll).toBeCalled();
//     // check response is correct or not
//     expect(successResponse).toHaveBeenCalledWith(
//       expect.any(Object),
//       expect.any(Object),
//       expect.any(Object),
//     );
//     // restore database/model function that we have mocked
//     spyUserFindAndCountAll.mockRestore();
//   });
// });

describe("User controller", () => {
  test("healthCheck", async () => {
    // const spyUserFindAndCountAll = jest
    //   .spyOn("healthCheck")
    //   .mockImplementation(() => Promise.resolve([]));

    // create request object and put value that you required to check in function
    const req = {};

    // call function
    let test = await healthCheck(req, res);
    console.log(test)
    // check database function is calling or not
    // expect(spyUserFindAndCountAll).toBeCalled();
    // check response is correct or not
    expect(successResponse).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      expect.any(Object)
    );
    // restore database/model function that we have mocked
    // spyUserFindAndCountAll.mockRestore();
  });
});
