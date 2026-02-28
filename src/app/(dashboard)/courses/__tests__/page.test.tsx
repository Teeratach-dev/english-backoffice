import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoursesPage from "../page";

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/features/courses/course-table", () => ({
  CourseTable: ({
    onEdit,
    addButton,
  }: {
    onEdit: (course: any) => void;
    addButton: React.ReactNode;
  }) => (
    <div data-testid="course-table">
      {addButton}
      <button
        data-testid="edit-course-btn"
        onClick={() => onEdit({ _id: "1", name: "Test Course" })}
      >
        Edit
      </button>
    </div>
  ),
}));

vi.mock("@/components/features/courses/course-form", () => ({
  CourseForm: ({
    initialData,
    onSuccess,
  }: {
    initialData: any;
    onSuccess: () => void;
  }) => (
    <div data-testid="course-form">
      <span data-testid="form-mode">
        {initialData ? "edit" : "add"}
      </span>
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

describe("CoursesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header with correct title", () => {
    render(<CoursesPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent("Courses");
  });

  it("renders course table", () => {
    render(<CoursesPage />);
    expect(screen.getByTestId("course-table")).toBeInTheDocument();
  });

  it("opens add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<CoursesPage />);

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    expect(screen.getByTestId("course-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("add");
  });

  it("opens edit dialog when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<CoursesPage />);

    await user.click(screen.getByTestId("edit-course-btn"));

    expect(screen.getByTestId("course-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
  });

  it("closes dialog and refreshes on form success", async () => {
    const user = userEvent.setup();
    render(<CoursesPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByTestId("course-form")).toBeInTheDocument();

    await user.click(screen.getByTestId("form-submit"));

    expect(screen.queryByTestId("course-form")).not.toBeInTheDocument();
  });
});
