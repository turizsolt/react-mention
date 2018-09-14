import * as React from 'react';
import { InputMentionProps, InputMentionState } from './InputMentionInterfaces';
export declare class InputMention extends React.Component<InputMentionProps, InputMentionState> {
    private refTextArea;
    constructor(props: InputMentionProps, state: InputMentionState);
    render(): JSX.Element;
    private getInitState;
    private setThisBindings;
    private onTextChange;
    private onKeyDown;
    private onKeyUp;
    private onTextClick;
    private onItemClick;
    private onItemMouseEnter;
    private isDown;
    private isUp;
    private isEscape;
    private isEnter;
    private handleDown;
    private handleUp;
    private handleEscape;
    private handleEnter;
    private insertMentionToText;
    private getInsertableMention;
    private isFilteredListHasElements;
    private filterCondition;
    private getPrevItemIndex;
    private getNextItemIndex;
    private isTriggeredByAt;
}
