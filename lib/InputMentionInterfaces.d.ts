export interface InputMentionListItem {
    id: number;
    mentionTag: string;
    text: string;
    imageUrl?: string;
}
export interface InputMentionProps {
    list: InputMentionListItem[];
    showSearchBar?: boolean;
    maxSize?: number;
}
export interface InputMentionState {
    currentOptionIndex: number;
    optionPosition: {
        left: number;
        top: number;
    };
    savedSelectionEnd: number;
    searchText: string;
    showOptions: boolean;
    startsFrom: number;
    text: string;
}
