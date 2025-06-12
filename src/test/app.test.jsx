import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import App from "../app";
import DBContextProvider from "../db-context";
import AppContextProvider from "../app-context";

const mockResponse = {
  data: [
    {
      content: "XYZ",
    },
  ],
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponse),
  }),
);

const Application = () => {
  return (
    <DBContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </DBContextProvider>
  );
};

describe("basic", () => {
  it("should render", async () => {
    render(<Application />);
    expect(
      await screen.findByRole("heading", { name: /hello/i }),
    ).toBeDefined();
    expect(
      await screen.findByRole("heading", {
        name: /how are you feeling today/i,
      }),
    ).toBeDefined();
    expect(await screen.findByText(/add your mood for today/i)).toBeDefined();

    const addMoodBtn = await screen.findByRole("button", { name: /add mood/i });
    expect(addMoodBtn).toBeDefined();

    expect(await screen.findByText(/average mood/i)).toBeDefined();

    expect(await screen.findByText(/average sleep/i)).toBeDefined();

    expect(await screen.findByText(/mood and sleep stats/i)).toBeDefined();
  });

  it("should show form", async () => {
    render(<Application />);

    const addMoodBtn = await screen.findByRole("button", { name: /add mood/i });
    expect(addMoodBtn).toBeDefined();

    fireEvent.click(addMoodBtn);

    expect(
      await screen.findByRole("button", { name: /very sad/i }),
    ).toBeDefined();
    expect(
      await screen.findByRole("button", { name: /neutral/i }),
    ).toBeDefined();
    const hBtn = await screen.findByRole("button", { name: /very happy/i });
    expect(hBtn).toBeDefined();
    fireEvent.click(hBtn);

    expect(
      await screen.findByRole("slider", { name: /8 hours/i }),
    ).toBeDefined();
    const done = await screen.findByRole("button", { name: /done/i });
    expect(done).toBeDefined();

    fireEvent.click(done);

    expect(screen.queryByRole("slider", { name: /8 hours/i })).toBeNull();

    const newReflection = await screen.findByRole("textbox", {
      name: /new reflection/i,
    });
    const addReflection = await screen.findByRole("button", { name: /add/i });
    expect(newReflection).toBeDefined();
    expect(addReflection).toBeDefined();
    fireEvent.change(newReflection, { target: { value: "ABC" } });
    fireEvent.click(addReflection);

    expect(await screen.findByText(/reflections/i)).toBeDefined();
    expect(await screen.findByText(/abc/i)).toBeDefined();
  });
});
