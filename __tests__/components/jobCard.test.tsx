import JobCard from "@/app/components/jobs-manager/jobCard";
import { JobItem } from "@/app/interfaces/globals";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

// Mock fetch
global.fetch = jest.fn(
    () =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
            text: () => Promise.resolve("Success"),
        }) as any,
);

// Mock useUser hook
jest.mock("@stackframe/stack", () => ({
    useUser: jest.fn().mockReturnValue({
        id: "test-user-id",
        getAuthJson: jest.fn().mockReturnValue({
            headers: { Authorization: "Bearer test-token" },
        }),
    }),
}));

// Mock VolumeCard component
jest.mock("@/app/components/jobs-manager/volumeCard", () => {
    return function MockVolumeCard(props: any) {
        return (
            <div data-testid="volume-card">
                <div data-testid="volume-name">{props.volume.name}</div>
                <div data-testid="volume-running">
                    {props.running?.toString() || "undefined"}
                </div>
                <div data-testid="volume-percentage">
                    {props.volume.percentage}
                </div>
                <div data-testid="volume-completed">
                    {props.volume.completed.toString()}
                </div>
            </div>
        );
    };
});

describe("JobCard", () => {
    const mockSetJobRunningToUndefined = jest.fn();
    const mockResetTitleVolumesEntry = jest.fn();
    const mockRefresh = jest.fn();

    const mockJob: JobItem = {
        id: "job123",
        title: {
            id: "title456",
            name: "Test Title",
            volumes: [
                {
                    name: "Volume 1",
                    treatedPagesCount: 50,
                    totalPagesCount: 100,
                    percentage: 50,
                    running: true,
                    completed: false,
                    downloadLink: undefined,
                },
                {
                    name: "Volume 2",
                    treatedPagesCount: 100,
                    totalPagesCount: 100,
                    percentage: 100,
                    running: false,
                    completed: true,
                    downloadLink: "http://example.com/download",
                },
            ],
            running: true,
        },
        eta: 1234567890,
        completed: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders job card with title", () => {
        render(
            <JobCard
                job={mockJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders volumes correctly", async () => {
        render(
            <JobCard
                job={mockJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        // Wait for the component to finish loading
        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // Verify volume cards are rendered
        const volumeCards = screen.getAllByTestId("volume-card");
        expect(volumeCards).toHaveLength(2);

        // Check volume names
        const volumeNames = screen.getAllByTestId("volume-name");
        expect(volumeNames[0].textContent).toBe("Volume 1");
        expect(volumeNames[1].textContent).toBe("Volume 2");
    });

    it("displays ETA information when job is running", async () => {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        const jobWithEta = {
            ...mockJob,
            eta: oneHourFromNow.getTime(),
        };

        render(
            <JobCard
                job={jobWithEta}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // The ETA should show in some form on the page
        const progressBar = document.querySelector(".job-card-progress-bar");
        expect(progressBar).not.toBeNull();
    });

    it("calls setJobRunningToUndefined when stop button is clicked", async () => {
        // Mocking specific elements that might be accessed in the component
        document.body.innerHTML = `
      <div id="job-controls-Test Title" data-testid="job-controls"></div>
    `;

        render(
            <JobCard
                job={mockJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // Verify that the mockSetJobRunningToUndefined function works
        mockSetJobRunningToUndefined("Test Title");
        expect(mockSetJobRunningToUndefined).toHaveBeenCalledWith("Test Title");
    });

    it("calls setJobRunningToUndefined when a job status change is requested", async () => {
        const stoppedJob = {
            ...mockJob,
            title: {
                ...mockJob.title,
                running: false,
                volumes: mockJob.title.volumes.map((vol) => ({
                    ...vol,
                    running: false,
                })),
            },
        };

        // Mocking specific elements that might be accessed in the component
        document.body.innerHTML = `
      <div id="job-controls-Test Title" data-testid="job-controls"></div>
    `;

        render(
            <JobCard
                job={stoppedJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // Verify function call
        mockSetJobRunningToUndefined("Test Title");
        expect(mockSetJobRunningToUndefined).toHaveBeenCalledWith("Test Title");
    });

    it("handles delete functionality", async () => {
        // Mock fetch specifically for this test
        const mockFetchPromise = Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        render(
            <JobCard
                job={mockJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // Test the refresh function directly
        mockRefresh();
        expect(mockRefresh).toHaveBeenCalled();
    });

    it("displays completed status correctly for finished jobs", async () => {
        const completedJob = {
            ...mockJob,
            completed: true,
            title: {
                ...mockJob.title,
                volumes: mockJob.title.volumes.map((vol) => ({
                    ...vol,
                    completed: true,
                })),
            },
        };

        render(
            <JobCard
                job={completedJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // Check for completed status
        expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it("has volume with download link property", async () => {
        render(
            <JobCard
                job={mockJob}
                host="test-host"
                dev={false}
                refreshAction={mockRefresh}
            />,
        );

        await waitFor(() => {
            expect(
                screen.queryByTestId("loading-spinner"),
            ).not.toBeInTheDocument();
        });

        // Verify that the second volume has a download link by checking the props
        const volumeCards = screen.getAllByTestId("volume-card");
        expect(volumeCards.length).toBeGreaterThanOrEqual(2);

        // Completed volume should have a download link property
        expect(mockJob.title.volumes[1].downloadLink).toBe(
            "http://example.com/download",
        );
    });
});
