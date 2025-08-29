"use client";

import { useEffect, useRef, useState } from "react";
import imagesLoaded from "imagesloaded";
import Link from "next/link";
import TitleCard from "./titleCard";
import { TitleItem } from "@/app/(protected)/app/titles-manager/pageContent";
import SearchBar from "./searchBar";
import styles from "@/app/(protected)/app/titles-manager/titlesManager.module.css";

export default function TitlesWrapper(props: { titles: TitleItem[] }) {
    const [inputText, setInputText] = useState<string>("");
    const currentTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const currentSearchBarInputVisibilityTimeout = useRef<
        NodeJS.Timeout | undefined
    >(undefined);
    const imagesInLoadingState = useRef<number[]>([]);
    const filteredTitles = props.titles.filter((title) => {
        return title["title-name"]
            .toLocaleLowerCase()
            .includes(inputText.toLocaleLowerCase());
    });
    const baseScroll = useRef<number>(0);
    const toScroll = useRef<number>(0);
    const currentMinScroll = useRef<number>(0);
    const currentMaxScroll = useRef<number>(0);
    const [jumpNeeded, setJumpNeeded] = useState<boolean>(false);

    if (filteredTitles.length === 0) {
        const contentContainer = document.getElementById(
            "titles-wrapper-content-container",
        );
        if (contentContainer) {
            contentContainer.style.visibility = "visible";
            setTimeout(() => {
                const searchLoading = document.getElementById(
                    "titles-wrapper-search-loading",
                );
                if (searchLoading) {
                    searchLoading.style.opacity = "0";
                    setTimeout(() => {
                        searchLoading.style.zIndex = "-1";
                    }, 500);
                }
            }, 500);
        }
    }

    /**
     * Set appropriate spanning to any titles list item
     *
     * Get different properties we already set for the titles list, calculate
     * height or spanning for any cell of the titles list grid based on its
     * content-wrapper's height, the (row) gap of the grid, and the size
     * of the implicit row tracks.
     *
     * @param item Object A brick/tile/cell inside the titles list
     * @link https://w3bits.com/css-grid-masonry/
     */
    function resizeTitlesList(item: any) {
        /* Get the grid object, its row-gap, and the size of its implicit rows */
        const grid = document.getElementsByClassName("titles-list")[0];
        if (grid) {
            const rowGap = parseInt(
                    window
                        .getComputedStyle(grid)
                        .getPropertyValue("grid-row-gap"),
                ),
                rowHeight = parseInt(
                    window
                        .getComputedStyle(grid)
                        .getPropertyValue("grid-auto-rows"),
                ),
                gridImagesAsContent = item.querySelector(
                    "img.titles-list-content",
                );

            /*
             * Spanning for any brick = S
             * Grid's row-gap = G
             * Size of grid's implicitly create row-track = R
             * Height of item content = H
             * Net height of the item = H1 = H + G
             * Net height of the implicit row-track = T = G + R
             * S = H1 / T
             */
            const rowSpan = Math.ceil(
                (item
                    .querySelector(".titles-list-content")
                    .getBoundingClientRect().height +
                    rowGap) /
                    (rowHeight + rowGap),
            );

            /* Set the spanning as calculated above (S) */
            item.style.gridRowEnd = "span " + rowSpan;
            if (gridImagesAsContent) {
                item.querySelector("img.titles-list-content").style.height =
                    item.getBoundingClientRect().height + "px";
            }
        }
    }

    /**
     * Apply spanning to all the titles list items
     *
     * Loop through all the items and apply the spanning to them using
     * `resizeTitlesList()` function.
     *
     * @uses resizeTitlesList
     * @link https://w3bits.com/css-grid-TitlesList/
     */
    function resizeAllTitlesList() {
        // Get all item class objects in one list
        const allItems = document.querySelectorAll(".titles-list-item");

        /*
         * Loop through the above list and execute the spanning function to
         * each list-item (i.e. each TitlesList item)
         */
        if (allItems) {
            for (let i = 0; i > allItems.length; i++) {
                resizeTitlesList(allItems[i]);
            }
        } else {
            console.error("Error: bruh");
        }
    }

    /**
     * Resize the items when all the images inside the titles list grid
     * finish loading. This will ensure that all the content inside our
     * TitlesList items is visible.
     *
     * @uses ImagesLoaded
     * @uses resizeTitlesList
     * @link https://w3bits.com/css-grid-TitlesList/
     */
    function waitForImages() {
        const allItems = document.querySelectorAll(".titles-list-item");
        if (allItems) {
            for (let i = 0; i < allItems.length; i++) {
                // We set the image as in a loading state
                imagesInLoadingState.current.push(i);
                imagesLoaded(allItems[i], function (instance: any) {
                    const item = instance.elements[0];
                    resizeTitlesList(item);
                    // When loaded, we remove the image from the array
                    // Once all the images have been removed from the array, we show the titles section to the user
                    imagesInLoadingState.current.splice(
                        imagesInLoadingState.current?.indexOf(i),
                        1,
                    );
                    if (imagesInLoadingState.current.length === 0) {
                        const contentContainer = document.getElementById(
                            "titles-wrapper-content-container",
                        );
                        const searchLoading = document.getElementById(
                            "titles-wrapper-search-loading",
                        );
                        if (contentContainer && searchLoading) {
                            contentContainer.style.visibility = "visible";
                            setTimeout(() => {
                                searchLoading.style.opacity = "0";
                                setTimeout(() => {
                                    searchLoading.style.zIndex = "-1";
                                }, 500);
                            }, 500);
                        }
                        if (jumpNeeded) {
                            // Reset scroll to the state previous typing
                            //TODO: Fix possible scrollTo induced layout shift
                            //window.scrollTo(0, toScroll.current);
                            toScroll.current = 0;
                            if (currentSearchBarInputVisibilityTimeout.current)
                                clearTimeout(
                                    currentSearchBarInputVisibilityTimeout.current,
                                );
                            currentSearchBarInputVisibilityTimeout.current =
                                setTimeout(() => {
                                    document.getElementById(
                                        "search-bar-container",
                                    )!.style.opacity = "1";
                                    document
                                        .getElementById(
                                            "title-manager-search-bar-input",
                                        )!
                                        .removeAttribute("disabled");
                                }, 1200);
                            setJumpNeeded(false);
                        }
                    }
                });
            }
        } else {
            console.error("Error: houston problem...");
        }
    }

    useEffect(() => {
        /* Resize all the grid items on the load and resize events */
        const TitlesList = ["load", "resize"];
        TitlesList.forEach(function (event) {
            window.addEventListener(event, resizeAllTitlesList);
        });

        /* Do a resize once more when all the images finish loading */
        waitForImages();
    });

    /**
     * Typing and titles filtering delay management
     * @param _inputText
     */
    const filterTitles = (_inputText: string) => {
        if (currentTimeout.current !== undefined) {
            clearTimeout(currentTimeout.current);
            currentTimeout.current = setTimeout(() => {
                if (inputText !== _inputText) {
                    //TODO: Remove the animate attr in titleCards so it reset the animation, and it can be triggered each time there's an update
                    const contentContainer = document.getElementById(
                        "titles-wrapper-content-container",
                    );
                    const searchLoading = document.getElementById(
                        "titles-wrapper-search-loading",
                    );
                    if (contentContainer && searchLoading) {
                        contentContainer.style.visibility = "hidden";
                        searchLoading.style.zIndex = "50";
                        searchLoading.style.opacity = "1";
                    }
                    setInputText(_inputText);

                    // console.log("base" + baseScroll.current);
                    // console.log("toscroll" + toScroll.current);

                    if (baseScroll.current === 0) {
                        baseScroll.current = window.pageYOffset;
                        toScroll.current = window.pageYOffset;
                        window.scrollTo(0, 0);
                    } else {
                        //console.log("input" + _inputText);
                        if (_inputText === "") {
                            //console.log("Scroll to implement");
                            setJumpNeeded(true);
                            baseScroll.current = 0;
                        } else {
                            window.scrollTo(0, 0);
                        }
                    }
                }
            }, 500);
        } else {
            currentTimeout.current = setTimeout(() => {
                if (inputText !== _inputText) {
                    //TODO: Remove the animate attr in titleCards so it reset the animation, and it can be triggered each time there's an update
                    const contentContainer = document.getElementById(
                        "titles-wrapper-content-container",
                    );
                    const searchLoading = document.getElementById(
                        "titles-wrapper-search-loading",
                    );
                    if (contentContainer && searchLoading) {
                        contentContainer.style.visibility = "hidden";
                        searchLoading.style.zIndex = "50";
                        searchLoading.style.opacity = "1";
                    }
                    setInputText(_inputText);

                    // console.log("base" + baseScroll.current);
                    // console.log("toscroll" + toScroll.current);

                    if (baseScroll.current === 0) {
                        baseScroll.current = window.pageYOffset;
                        toScroll.current = window.pageYOffset;
                        window.scrollTo(0, 0);
                    } else {
                        //console.log("input" + _inputText);
                        if (_inputText === "") {
                            //console.log("Scroll to implement");
                            setJumpNeeded(true);
                            baseScroll.current = 0;
                        } else {
                            window.scrollTo(0, 0);
                        }
                    }
                }
            }, 500);
        }
    };

    /**
     * Show or hide the searchBar depending on scrolling
     * @param value
     */
    const handleScroll = (value: number) => {
        if (value > currentMaxScroll.current) {
            currentMinScroll.current = value;
            currentMaxScroll.current = value;
            const searchBarContainer = document.getElementById(
                "search-bar-container",
            );
            const searchBarInput = document.getElementById(
                "title-manager-search-bar-input",
            );
            if (searchBarContainer) {
                //searchBarContainer.style.opacity = "0";
                searchBarContainer.style.display = "none";
            }
            if (searchBarInput) {
                searchBarInput.setAttribute("disabled", "true");
            }
        } else if (value < currentMinScroll.current) {
            currentMinScroll.current = value;
        } else {
            currentMinScroll.current = value;
            currentMaxScroll.current = value;
        }

        if (currentMaxScroll.current - currentMinScroll.current > 0) {
            const searchBarContainer = document.getElementById(
                "search-bar-container",
            );
            const searchBarInput = document.getElementById(
                "title-manager-search-bar-input",
            );
            if (searchBarContainer) {
                searchBarContainer.style.display = "block";
                //searchBarContainer.style.opacity = "1";
            }
            if (searchBarInput) {
                searchBarInput.removeAttribute("disabled");
            }
            currentMaxScroll.current = value;
        }
    };

    useEffect(() => {
        window.addEventListener(
            "scroll",
            function () {
                handleScroll(window.pageYOffset);
            },
            true,
        );
    }, []);

    return (
        <section className="titles-wrapper-container flex flex-col items-center w-full">
            <div
                id="search-bar-container"
                className="w-full with-opacity-transition"
            >
                <SearchBar filterTitles={filterTitles}></SearchBar>
            </div>
            <div
                id="titles-wrapper-search-loading"
                className="w-full h-screen flex justify-center with-opacity-transition absolute z-50"
                style={{
                    height: "100%",
                    marginTop: "6rem",
                    opacity: "1",
                    backgroundColor: "var(--background)",
                }}
            >
                <span
                    className={
                        styles["titles-wrapper-search-loading"] +
                        " big-loader-foreground "
                    }
                ></span>
            </div>

            <section
                id="titles-wrapper-content-container"
                className={
                    styles["titles-list-wrapper"] +
                    " animate with-opacity-transition"
                }
            >
                <ul className={`${styles["titles-list"]} titles-list`}>
                    {filteredTitles.map((title: TitleItem) => (
                        <Link
                            className={`${styles["titles-list-item"]} titles-list-item min-w-max`}
                            key={title.id}
                            href={{
                                pathname: `/app/titles/${title.id}`,
                                query: { name: title["title-name"] },
                            }}
                            scroll={false}
                            prefetch={false}
                        >
                            <TitleCard
                                key={title.id}
                                title={title}
                                dev={process.env.MODE === "developpment"}
                            ></TitleCard>
                        </Link>
                    ))}
                </ul>
            </section>
        </section>
    );
}
