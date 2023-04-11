"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("returns error JSON if inputs are invalid", async function () {
    const testShipment = {
      productId: 4,
      name: 1,
      zip: 12345,
      size: "large"
    }
    // TODO: Break into two separate tests (right items but wrong values; wrong
    // items)
    // TODO: Separate status code expect statement
    const resp = await request(app).post("/shipments").send(testShipment);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId must be greater than or equal to 1000",
          "instance.name is not of a type(s) string",
          "instance.zip is not of a type(s) string",
          "instance is not allowed to have the additional property \"size\"",
          "instance requires property \"addr\""
        ],
        "status": 400
      }
    });
  })

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });


});
