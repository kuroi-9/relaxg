'use client'

import { useEffect, useRef, useState } from "react";
import imagesLoaded from "imagesloaded";
import Link from "next/link";
import TitleCard from "./titleCard";
import { TitleItem } from "@/app/(protected)/app/titles-manager/page";
import SearchBar from "./searchBar";

export default function TitlesWrapper(props: { titles: TitleItem[] }) {
    const [inputText, setInputText] = useState<string>('');
    const currentTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const imagesInLoadingState = useRef<number[]>([])
    const filteredTitles = props.titles.filter((title) => {
        return title["title-name"]
            .toLocaleLowerCase()
            .includes(
                inputText.toLocaleLowerCase());
    });

    if (filteredTitles.length === 0) {
        document.getElementById('titles-wrapper-content-container')!.style.visibility = 'visible';
        document.getElementById('titles-wrapper-search-loading')!.style.display = 'none';
    }


    /**
    * Set appropriate spanning to any masonry item
    *
    * Get different properties we already set for the masonry, calculate 
    * height or spanning for any cell of the masonry grid based on its 
    * content-wrapper's height, the (row) gap of the grid, and the size 
    * of the implicit row tracks.
    *
    * @param item Object A brick/tile/cell inside the masonry
    * @link https://w3bits.com/css-grid-masonry/
    */
    function resizeMasonryItem(item: any) {
        /* Get the grid object, its row-gap, and the size of its implicit rows */
        const grid = document.getElementsByClassName('masonry')[0];
        if (grid) {
            const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
                rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')),
                gridImagesAsContent = item.querySelector('img.masonry-content');

            /*
             * Spanning for any brick = S
             * Grid's row-gap = G
             * Size of grid's implicitly create row-track = R
             * Height of item content = H
             * Net height of the item = H1 = H + G
             * Net height of the implicit row-track = T = G + R
             * S = H1 / T
             */
            const rowSpan = Math.ceil((item.querySelector('.masonry-content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

            /* Set the spanning as calculated above (S) */
            item.style.gridRowEnd = 'span ' + rowSpan;
            if (gridImagesAsContent) {
                item.querySelector('img.masonry-content').style.height = item.getBoundingClientRect().height + "px";
            }
        }
    }

    /**
     * Apply spanning to all the masonry items
     *
     * Loop through all the items and apply the spanning to them using 
     * `resizeMasonryItem()` function.
     *
     * @uses resizeMasonryItem
     * @link https://w3bits.com/css-grid-masonry/
     */
    function resizeAllMasonryItems() {
        // Get all item class objects in one list
        const allItems = document.querySelectorAll('.masonry-item');

        /*
         * Loop through the above list and execute the spanning function to
         * each list-item (i.e. each masonry item)
         */
        if (allItems) {
            for (let i = 0; i > allItems.length; i++) {
                resizeMasonryItem(allItems[i]);
            }
        }
    }

    /**
     * Resize the items when all the images inside the masonry grid 
     * finish loading. This will ensure that all the content inside our
     * masonry items is visible.
     *
     * @uses ImagesLoaded
     * @uses resizeMasonryItem
     * @link https://w3bits.com/css-grid-masonry/
     */
    function waitForImages() {
        const allItems = document.querySelectorAll('.masonry-item');
        if (allItems) {
            for (let i = 0; i < allItems.length; i++) {
                // We set the image as in a loading state
                imagesInLoadingState.current.push(i);
                imagesLoaded(allItems[i], function (instance: any) {
                    const item = instance.elements[0];
                    resizeMasonryItem(item);
                    // When loaded, we remove the image from the array
                    // Once all the images have been removed from the array, we show the titles section to the user
                    imagesInLoadingState.current.splice(imagesInLoadingState.current?.indexOf(i), 1);
                    if (imagesInLoadingState.current.length === 0) {
                        document.getElementById('titles-wrapper-content-container')!.style.visibility = 'visible';
                        document.getElementById('titles-wrapper-search-loading')!.style.display = 'none';
                    }
                });
            }
        }
    }

    useEffect(() => {
        /* Resize all the grid items on the load and resize events */
        const masonryEvents = ['load', 'resize'];
        masonryEvents.forEach(function (event) {
            window.addEventListener(event, resizeAllMasonryItems);
        });

        /* Do a resize once more when all the images finish loading */
        waitForImages();
    })

    /**
     * Typing and titles filtering delay management
     * @param _inputText 
     */
    const filterTitles = (_inputText: string) => {
        if (currentTimeout.current !== undefined) {
            clearTimeout(currentTimeout.current);
            currentTimeout.current = setTimeout(() => {
                if (inputText !== _inputText) {
                    document.getElementById('titles-wrapper-content-container')!.style.visibility = 'hidden';
                    document.getElementById('titles-wrapper-search-loading')!.style.display = 'inline-block';
                    setInputText(_inputText);
                }
            }, 500)
        } else {
            currentTimeout.current = setTimeout(() => {
                if (inputText !== _inputText) {
                    document.getElementById('titles-wrapper-content-container')!.style.visibility = 'hidden';
                    document.getElementById('titles-wrapper-search-loading')!.style.display = 'inline-block';
                    setInputText(_inputText);
                }
            }, 500)
        }
    }

    return (
        <section className="flex flex-col items-center w-full">
            <SearchBar filterTitles={filterTitles}></SearchBar>
            <span
                id="titles-wrapper-search-loading"
                className="loader"
                style={{
                    minWidth: "80px",
                    minHeight: "80px",
                    margin: "10%"
                }}></span>
            <section id="titles-wrapper-content-container" className="masonry-wrapper">
                <ul className="masonry">
                    {filteredTitles.map((title: TitleItem) => (
                        <Link
                            className="masonry-item rounded-md min-w-max"
                            key={title.id} href={{
                                pathname: `/app/titles/${title.id}`,
                                query: { name: title["title-name"] }
                            }} scroll={false}>
                            <TitleCard
                                key={title.id}
                                title={title}
                                dev={(process.env.MODE === 'developpment')}
                            ></TitleCard>
                        </Link>
                    ))}
                </ul>
            </section>
        </section>
    );
}