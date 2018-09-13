export interface InputMentionListItem {
    mentionTag: string;
    text: string;
    imageUrl?: string;
}

export interface InputMentionProps {
    list: InputMentionListItem[];
    showSearchBar?: boolean;
}

export interface InputMentionState {
    currentOptionIndex: number;
    optionPosition: {
        left: number,
        top: number
    };
    savedSelectionEnd: number,
    searchText: string;
    showOptions: boolean;
    startsFrom: number;
    text: string;
}
