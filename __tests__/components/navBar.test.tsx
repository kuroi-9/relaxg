import { render, screen } from "@testing-library/react";
import NavBar from "@/app/components/navBar";

describe("NavBar", () => {
    it("renders navigation links", () => {
        render(<NavBar />);

        expect(screen.getByText("Jobs Manager")).toBeDefined();
        expect(screen.getByText("Titles Manager")).toBeDefined();
    });

    it("renders leave button", () => {
        render(<NavBar />);
        expect(screen.getByText("Leave")).toBeDefined();
    });
});
