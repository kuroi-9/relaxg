'use client'

import styles from './titleActionsModal.module.css'

export default function TitleActionsModal({titleName}) {
    return (
        <>
            <div className={styles.darkBG} onClick={() => console.log('erger')}/>
            <div className={styles.centered}>
                <div className={styles.content}>
                    <div className="titleActionsModal__header border-b-2">
                        {titleName}
                    </div>
                    <div className="titleActionsModal__body">
                        Please choose an action below.
                    </div>
                    <div className="titleActionsModal__footer flex flex-row w-1/2 justify-between">
                        <button className={styles.actionButton}>Create Job</button>
                        <button className={styles.actionButton}>Delete previous upscaling</button>
                        <button className={styles.actionButton}>Exit</button>
                    </div>
                </div>
            </div>
        </>
    )
}