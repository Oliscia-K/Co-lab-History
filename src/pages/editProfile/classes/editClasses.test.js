import { render, screen, fireEvent, getByTestId } from "@testing-library/react";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react"
import EditClasses from "./index"
import ProfileAddPartners from "./add";

jest.mock("next-auth/react");
jest.mock('next/router', () => jest.requireActual('next-router-mock'))

describe("Testing editClasses componenet", () => {

  beforeEach(() => {
    
    useSession.mockReturnValue({
      data: {
        user: { id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });

  });

  test("ClassesScrollBar is on the page", () => {

    const mockedUser = {
      id: 1,
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };

    render(<EditClasses currentUser={mockedUser}/>);
    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();

    });

    test("Add and back buttons are on the page", () => {

      const mockedUser = {
        id: 1,
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      };
  
      render(<EditClasses currentUser={mockedUser} />);
      expect(screen.getByTestId("add")).toBeVisible();
      expect(screen.getByTestId("add")).toContainHTML("Add");
      expect(screen.getByTestId("back")).toBeVisible();
      expect(screen.getByTestId("back")).toContainHTML("Back");

    });

    test("Add button redirects user to add page", () => {
      const mockedUser = {
        id: 1,
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      };
  
      render(<EditClasses currentUser={mockedUser} />);
      const addLink = screen.getByRole("link", {name: "Add" });
      expect(addLink).toHaveAttribute("href", "/editProfile/classes/add");
    

    });  

    test("Back button redirects user to homepage", () => {
      const mockedUser = {
        id: 1,
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      };
  
      render(<EditClasses currentUser={mockedUser} />);
      const cancelLink = screen.getByRole("link", {name: "Back"});
      expect(cancelLink).toHaveAttribute("href", "/user/1/userProfile");
    });

    // test("Elements of add page are present", () => {
    //   render(<ProfileAddPartners/>)
    //   expect(getByTestId("scrollbar")).toBeInTheDocument();
    //   expect(getByTestId("add")).toBeInTheDocument();
    //   expect(getByTestId("cancel")).toBeInTheDocument();
    //   expect(getByTestId("save")).toBeInTheDocument();

    // });

    // test("Adding a test adds it to the classes scrollbar component", () => {

    // });

    // test("After adding a class, textboxes go back to default value", () => {

    // });

    // test("Expect courses to be properly fetched and displayed as options in select bar", () => {
    //   render()

    // });
  

    // test("Add button does not add a class if none is selected", () => {

    // });





});


// import { render, screen, fireEvent } from "@testing-library/react";
// import { getServerSession } from "next-auth/next";
// import { knex } from "../../../../knex/knex";
// import EditClasses from "./index";

// jest.mock("next-auth/next");

// describe("Testing editClasses componenet", () => {

//     beforeAll(() =>
//       // Ensure test database is initialized before an tests
//       knex.migrate.rollback().then(() => knex.migrate.latest()),
//     );
    
//     afterAll(() =>
//       // Ensure database connection is cleaned up after all tests
//       knex.destroy(),
//     );

//     beforeEach(() => {
//       getServerSession.mockReturnValue({
//         data: {
//           user: { id: 1 },
//           expires: new Date(Date.now() + 2 * 86400).toISOString(),
//         },
//         status: "authenticated",
//       });
//         return knex.seed.run();
//     });

//     afterEach(() => {
//       getServerSession.mockReset();
//     });

//     test("ClassesScrollBar is on the page", () => {

//         render(<EditClasses />);
//         expect(screen.getByTestId("scrollbar")).toBeVisible();
//     });

//     test("Add button is on the page", () => {
  
//         render(<EditClasses />);
//         expect(screen.getByTestId("add")).toBeVisible();
//         expect(screen.getByTestId("add")).toContainHTML("Add");
//     });

//     test("Cancel button is on the page", () => {

//         render(<EditClasses />);
//         expect(screen.getByTestId("cancel")).toBeVisible();
//         expect(screen.getByTestId("cancel")).toContainHTML("Cancel");
//     });

//     test("Save button is on the page", () => {

//         render(<EditClasses />);
//         expect(screen.getByTestId("save")).toBeVisible();
//         expect(screen.getByTestId("save")).toContainHMTL("Save");
//     });
//   });

//   //Stuff that needs to be tested later
//   //   test("Add button redirects user to add page", () => {

//   //     mockRouter.push(`/editProfile/classes/index`);
//   //     render(<EditClasses />);

//   //     const addButton = screen.getByRole("button", { name: "Add" });
//   //     fireEvent.click(addButton);
//   //     expect(mockRouter.asPath).toBe(`/editProfile/classes/add`)
//   //   });

//   // //   describe("Save button redirects user to home page", () => {
//   // //     const saveButton = screen.getByRole("button", { name: "Save" });
//   // //     fireEvent.click(saveButton);
//   // //   });

//   // test("Cancel button redirects user to home page", () => {

//   //       mockRouter.push(`/editProfile/classes/index`);
//   //       render(<EditClasses />);

//   //       const cancelButton = screen.getByRole("button", { name: "Cancel" });
//   //       fireEvent.click(cancelButton);
//   //       expect(mockRouter.asPath).toBe(`/`);
//   // });