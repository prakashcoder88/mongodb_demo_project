const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const should = chai.should();
const server = require("../server");
const responseMeassage = require('../src/utils/responseMeassage.json')
const { StatusCodes } = require("http-status-codes");
const { expect } = chai;
chai.use(chaiHttp);
chai.should();

let token;

//Register user
describe("addUser API", () => {
  it("should create a new user", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send({
        name: "Rakesh Patel",
        email: "rakesh@example.com",
        password: "Admin@123",
        phone: "1000000009",
        address: {
          address_Line_1: "Ahmedabad",
          City: "Ahmedabad",
          State: "Gujarat",
          PostalCode: "380061",
          Country: "India",
        },

        referral: "CLf4Yyzn",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal(responseMeassage.created);
        done();
      });
  });
});

//create seller
// describe("Create seller API", () => {
//     it("should create a seller the company name required", (done) => {
//       chai
//         .request(server)
//         .post("/user/create-update-role")
//         .send({
//           role: "seller",
//           name: "Test",
//           companyName:"vhits",
//           email: "test4@gmail.com",
//           password: "Test@123",
//           address: "5/shreeram",
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(201);
//           expect(res.body.message).to.equal("Seller created successfully");
//           done();
//         });
//     });
//   });

//update seller
// describe("update seller API", () => {
//     it("should update seller  id is required", (done) => {
//       chai
//         .request(server)
//         .post("/user/create-update-role")
//         .send({
//             id:"655ee49f795e30abd51d10f9",
//           name: "bharvee",
//           companyName:"vhits",
//           email: "test4@gmail.com",
//           address: "5/shreeram",
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(201);
//           expect(res.body.message).to.equal("Seller updated successfully");
//           done();
//         });
//     });
//   });

//update user
// describe("update user API", () => {
//     it("should update user id is required", (done) => {
//       chai
//         .request(server)
//         .post("/user/create-update-role")
//         .send({
//             id:"655ee26db85f6430be6dc324",
//           name: "bharvee",
//           companyName:"vhits",
//           email: "bharvee@gmail.com",
//           address: "5/shreeram",
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(201);
//           expect(res.body.message).to.equal("User updated successfully");
//           done();
//         });
//     });
//   });

//email id alredy exist
// describe("Email already exist", () => {
//   it("should throw message email already exist ", (done) => {
//     chai
//       .request(server)
//       .post("/user/create-update-role")
//       .send({
//         role: "user",
//         name: "Test",
//         email: "test1@gmail.com",
//         password: "Test@123",
//         address: "5/shreeram",
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal(
//           "Emailid already exist"
//         );
//         done();
//       });
//   });
// });

//password formate
// describe("Valid password formate", () => {
//   it("should create a user the password must be in a formate", (done) => {
//     chai
//       .request(server)
//       .post("/user/create-update-role")
//       .send({
//         role: "user",
//         name: "dharmik5",
//         email: "dharmik5@gmail.com",
//         password: "test@123",
//         address: "5/shreeram",
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Password length shoud be 8 to 16 digits and atlest one capital-latter, one small-latter, one number and one special symbol required");
//         done();
//       });
//   });
// });

//login user & seller
// describe("Login API", () => {
//   it("should return 200 with user details and JWT token if login is successful", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-login")
//       .send({ email: "test3@gmail.com", password: "Test@123" })
//       .end((err, res) => {
//         token = res.body.data.token;

//         expect(res).to.have.status(200);
//         // expect(res.body.message).to.equal(`${
//         //     role.role.charAt(0).toUpperCase() + role.role.slice(1)
//         //   } login successfully`);
//         done();
//       });
//   });
//   it("should return 400 if user is not found", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-login")
//       .send({ email: "testadmin111@example.com", password: "password123" })
//       .end((err, res) => {
//         expect(res).to.have.status(404);
//         expect(res.body.message).to.equal("Your account not found");
//         done();
//       });
//   });
//   it("should return 401 if Your account is not active", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-login")
//       .send({ email: "dharmik1@gmail.com", password: "Test@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.message).to.equal("Your account is not active");
//         done();
//       });
//   });
//   it("should return 401 if Password is invalid", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-login")
//       .send({ email: "test4@gmail.com", password: "Test@321" })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.message).to.equal(
//           "Password is invalid please enter valid password"
//         );
//         done();
//       });
//   });
// });

//update password
// describe("Update password", () => {
//   it("should all field required", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-change-password")
//       .set("token", token)
//       .send({
//         oldPassword: "Love@123",
//         // newPassword:'Love@123',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.message).to.equal("All fields are required");
//         done();
//       });
//   });

//   it("should enter valied password formate ", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Tove@123", newPassword: "love@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal(
//           "Password length shoud be 8 to 16 digits and atlest one capital-latter, one small-latter, one number and one special symbol required"
//         );
//         done();
//       });
//   });

//   it("should enter valied oldpassword ", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Tove@123", newPassword: "Love@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Please enter valid old password");
//         done();
//       });
//   });

//   it("should newpassword different from oldpassword ", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Love@123", newPassword: "Love@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal(
//           "New password must be different from oldpassword"
//         );
//         done();
//       });
//   });

//   it("should update password", (done) => {
//     chai
//       .request(server)
//       .post("/user/role-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Love@123", newPassword: "Test@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("Password changed successfully");
//         done();
//       });
//   });
// });

//get user or seller one
// describe('Get details', () => {
//     it("should return a login user or seller details", (done) => {
//         chai
//             .request(server)
//             .get("/user/getDetails")
//             .set("token", token)
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 done();
//             });
//     });
// })

//admin login
// describe("Admin Login API", () => {
//     it("should return 200 with admin details and JWT token if login is successful", (done) => {
//       chai
//         .request(server)
//         .post("/admin/admin-login")
//         .send({ email: "Love@gmail.com", password: "Pmpatel@$3477" })
//         .end((err, res) => {
//           token = res.body.data.token;
//           expect(res).to.have.status(200);
//           expect(res.body.message).to.equal("Admin login successfully");
//           done();
//         });
//     });
//     it("should return 400 if admin is not found", (done) => {
//       chai
//         .request(server)
//         .post("/admin/admin-login")
//         .send({ email: "testadmin111@example.com", password: "password123" })
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           expect(res.body.message).to.equal("Admin not found");
//           done();
//         });
//     });

//     it("should return 401 if Password is invalid", (done) => {
//       chai
//         .request(server)
//         .post("/admin/admin-login")
//         .send({ email: "Love@gmail.com", password: "Test@321" })
//         .end((err, res) => {
//           expect(res).to.have.status(401);
//           expect(res.body.message).to.equal(
//             "Please enter a valid password"
//           );
//           done();
//         });
//     });
//   });

//admin update password
// describe("Update password", () => {
//   it("should all field required", (done) => {
//     chai
//       .request(server)
//       .post("/admin/admin-change-password")
//       .set("token", token)
//       .send({
//         oldPassword: "Pmpatel@$1997",
//         // newPassword:'Love@123',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(403);
//         expect(res.body.message).to.equal("All fields are required");
//         done();
//       });
//   });

//   it("should enter valied password formate ", (done) => {
//     chai
//       .request(server)
//       .post("/admin/admin-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Pmpatel@$1997", newPassword: "love@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal(
//           "Password length shoud be 8 to 16 digits and atlest one capital-latter, one small-latter, one number and one special symbol required"
//         );
//         done();
//       });
//   });

//   it("should enter valied oldpassword ", (done) => {
//     chai
//       .request(server)
//       .post("/admin/admin-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Tove@123", newPassword: "Love@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Please enter valid old password");
//         done();
//       });
//   });

//   it("should newpassword different from oldpassword ", (done) => {
//     chai
//       .request(server)
//       .post("/admin/admin-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Pmpatel@$1997", newPassword: "Pmpatel@$1997" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal(
//           "New password must be different from oldpassword"
//         );
//         done();
//       });
//   });

//   it("should update password", (done) => {
//     chai
//       .request(server)
//       .post("/admin/admin-change-password")
//       .set("token", token)
//       .send({ oldPassword: "Pmpatel@$1997", newPassword: "Pmpatel@$3477" })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body.message).to.equal("Password changed successfully");
//         done();
//       });
//   });
// });

// get deshboard
// describe('Get deshboard', () => {
//     it("should return a deshboard", (done) => {
//         chai
//             .request(server)
//             .get("/admin/dashboard")
//             .set("token", token)
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 done();
//             });
//     });
// })

//update admin profile
// describe("Update admin profile", () => {
//   it("should update data", (done) => {
//     chai
//       .request(server)
//       .post("/admin/update-admin-profile")
//       .set("token", token)
//       .send({ name: "Love", email: "Love@gmail.com" })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("Data update successfully");
//         done();
//       });
//   });
// });

//add cart
// describe("Create add to cart API", () => {
//     it("should user login required for create cart order", (done) => {
//       chai
//         .request(server)
//         .post("/cart/add-to-cart")
//         .set("token", token)
//         .send({
//             productId: "655da126988a262d9972ed90",
//             quantity: 2,
//             price: 200,
//             type: "+"
//         })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body.message).to.equal("Cart added successfully");
//           done();
//         });
//     });
//   });

//get cart
// describe('Get cart', () => {
//     it("get cart order successfully", (done) => {
//         chai
//             .request(server)
//             .get("/cart/get-cart")
//             .set("token", token)
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body.message).to.equal("Cart get successfully");
//                 done();
//             });
//     });
// })

//get all cart
// describe('Get all cart', () => {
//     it("get all cart order successfully", (done) => {
//         chai
//             .request(server)
//             .get("/cart/get-all-cart")
//             .set("token", token)
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body.message).to.equal("Cart get successfully");
//                 done();
//             });
//     });
// })

//product create by seller
// describe("seller addProduct API", () => {
//   it("should seller create a  product", (done) => {
//     chai
//       .request(server)
//       .post("/product/create-product")
//       .set("token", token)
//       .send({
//         productName:"shirt",
//         description:"size-xxl,color-black",
//         category:"mans ware",
//         date:"20-11-2023",
//         price:"4000"

//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body.message).to.equal("Product added successfully");
//         done();
//       });
//   });
// });
