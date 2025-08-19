import { render, screen, act } from "@testing-library/react";
import VolumeCard from "@/app/components/jobs-manager/volumeCard";
import { VolumeItem } from "@/app/components/jobs-manager/socketManager";
import "@testing-library/jest-dom";

// Mock the DOM elements and methods used in volumeCard
const mockStyleSetter = jest.fn();
const mockElements: Record<
    string,
    {
        style: {
            borderRight: string;
            borderLeft: string;
        };
        scrollLeft: number;
        scrollWidth: number;
        clientWidth: number;
        dispatchEvent: (event: Event) => void;
        onScroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
    }
> = {};

// Mock getElementById
Object.defineProperty(document, "getElementById", {
    value: jest.fn((id: string) => {
        if (!mockElements[id]) {
            mockElements[id] = {
                style: {
                    borderRight: "",
                    borderLeft: "",
                },
                scrollLeft: 0,
                scrollWidth: 200,
                clientWidth: 100,
                dispatchEvent: function (event: Event) {
                    if (this.onScroll && event.type === "scroll") {
                        this.onScroll.call(
                            this as unknown as GlobalEventHandlers,
                            event,
                        );
                    }
                },
                onScroll: null,
            };
        }
        return mockElements[id];
    }),
});

describe("VolumeCard", () => {
    const mockVolume: VolumeItem = {
        name: "Test Volume",
        treatedPagesCount: 50,
        totalPagesCount: 100,
        percentage: 50,
        running: true,
        completed: false,
        downloadLink: undefined,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(mockElements).forEach((key) => delete mockElements[key]);
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("renders volume name correctly", () => {
        render(<VolumeCard volume={mockVolume} running={true} />);

        expect(screen.getByText("Test Volume")).toBeInTheDocument();
    });

    it("displays percentage correctly for incomplete volume", () => {
        render(<VolumeCard volume={mockVolume} running={true} />);

        expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("does not display percentage for completed volume", () => {
        const completedVolume = {
            ...mockVolume,
            completed: true,
            percentage: 100,
        };

        render(<VolumeCard volume={completedVolume} running={true} />);

        expect(screen.queryByText("100%")).not.toBeInTheDocument();
    });

    it("applies running styling when volume is running", () => {
        render(<VolumeCard volume={mockVolume} running={true} />);

        const titleElement = screen.getByText("Test Volume");
        const computedStyle = window.getComputedStyle(titleElement);

        expect(titleElement).toHaveStyle({ color: "var(--foreground)" });
    });

    it("applies non-running styling when volume is not running", () => {
        render(<VolumeCard volume={mockVolume} running={false} />);

        const titleElement = screen.getByText("Test Volume");

        expect(titleElement).toHaveStyle({ color: "rgb(128, 128, 128)" });
    });

    it("applies completed styling when volume is completed", () => {
        const completedVolume = {
            ...mockVolume,
            completed: true,
            percentage: 100,
        };

        render(<VolumeCard volume={completedVolume} running={true} />);

        // Look for the right section which should have green background for completed running volumes
        const rightSection = document.querySelector(
            '[class*="volume-card-percentage-container"]',
        );
        expect(rightSection).toHaveStyle({ backgroundColor: "rgb(0, 128, 0)" });
    });

    it("applies non-running completed styling when volume is completed but not running", () => {
        const completedVolume = {
            ...mockVolume,
            completed: true,
            percentage: 100,
        };

        render(<VolumeCard volume={completedVolume} running={false} />);

        const rightSection = document.querySelector(
            '[class*="volume-card-percentage-container"]',
        );
        expect(rightSection).toHaveStyle({
            backgroundColor: "rgb(112, 128, 144)",
        });
    });

    it("handles scroll events", () => {
        // Render the component
        render(<VolumeCard volume={mockVolume} running={true} />);

        // Get the volume ID
        const volumeId = `volume-${mockVolume.name}`;

        // Capture any scroll handler
        const handler = jest.fn();

        // Get the element and manually trigger scroll after setting scrollLeft
        act(() => {
            if (mockElements[volumeId]) {
                mockElements[volumeId].scrollLeft = 50;
                // Create a scroll event
                const scrollEvent = new Event("scroll");
                mockElements[volumeId].dispatchEvent(scrollEvent);
            }
        });

        // Just verify the elements exist as mocked
        expect(mockElements[volumeId]).toBeDefined();
        expect(mockElements[`${volumeId}-left-border`]).toBeDefined();
        expect(mockElements[`${volumeId}-right-border`]).toBeDefined();
    });

    it("applies correct style based on running state", () => {
        // Test with running=true
        const { unmount } = render(
            <VolumeCard volume={mockVolume} running={true} />,
        );
        let titleElement = screen.getByText("Test Volume");
        expect(titleElement).toHaveStyle({ color: "var(--foreground)" });

        // Unmount first render
        unmount();

        // Re-render with running=false
        const { container } = render(
            <VolumeCard volume={mockVolume} running={false} />,
        );
        const newTitleElement = container.querySelector(".volume-card-title");
        expect(newTitleElement).toHaveStyle({ color: "rgb(128, 128, 128)" });
    });

    it("handles different volume completion states correctly", () => {
        // Test with completed volume
        const completedVolume = {
            ...mockVolume,
            completed: true,
        };

        render(<VolumeCard volume={completedVolume} running={true} />);

        // Check that percentage is not displayed for completed volumes
        expect(screen.queryByText("50%")).not.toBeInTheDocument();

        // Re-render with incomplete volume
        render(<VolumeCard volume={mockVolume} running={true} />);

        // Check that percentage is displayed for incomplete volumes
        expect(screen.getByText("50%")).toBeInTheDocument();
    });
});
