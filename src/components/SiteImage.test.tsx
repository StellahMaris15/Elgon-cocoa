import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteImage } from "./SiteImage";
import { ProductGallery } from "./ProductGallery";
import { cropHero, normalizeImageSource, productImages } from "@/data/cropImages";

afterEach(cleanup);

describe("image delivery", () => {
  it("uses a crop fallback when a remote image fails, then an honest placeholder", () => {
    render(<SiteImage src="https://example.test/missing.jpg" fallbackSrc={cropHero.coffee} alt="Coffee" />);
    const image = screen.getByRole("img");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", cropHero.coffee);
    fireEvent.error(image);
    expect(image).toHaveAttribute("alt", "Image unavailable: Coffee");
    expect(image.getAttribute("src")).toContain("image-placeholder.svg");
  });
  it("loads a new source after the previous source failed", () => {
    const { rerender } = render(<SiteImage src="/missing.jpg" alt="Coffee" />);
    fireEvent.error(screen.getByRole("img"));
    rerender(<SiteImage src={cropHero.coffee} alt="Coffee" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", cropHero.coffee);
  });
  it("repairs and deduplicates old catalog paths while preserving uploaded URLs", () => {
    const old = "/__l5e/assets-v1/old-id/Vanilla_2.jpg";
    expect(normalizeImageSource(old)).toBe(cropHero.vanilla);
    expect(productImages([old, old, null, ""], "vanilla")).toEqual([cropHero.vanilla]);
    expect(productImages([], "coffee")).toEqual([cropHero.coffee]);
    expect(productImages(["https://example.test/photo.jpg"], "coffee")).toEqual(["https://example.test/photo.jpg"]);
  });
  it("renders an empty gallery without a broken source or invalid counter", () => {
    render(<ProductGallery images={[]} name="Coffee" fallbackSrc={cropHero.coffee} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", cropHero.coffee);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByText("1 / 0")).not.toBeInTheDocument();
  });
});
