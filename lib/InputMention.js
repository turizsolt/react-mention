"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var InputMentionStyles_1 = require("./InputMentionStyles");
var getCaretCoordinates = require('textarea-caret');
var InputMention = (function (_super) {
    __extends(InputMention, _super);
    function InputMention(props, state) {
        var _this = _super.call(this, props, state) || this;
        _this.refTextArea = React.createRef();
        _this.state = _this.getInitState();
        _this.setThisBindings();
        return _this;
    }
    InputMention.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: InputMentionStyles_1.styles.outerDiv },
            React.createElement("textarea", { ref: this.refTextArea, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onChange: this.onTextChange, onClick: this.onTextClick, value: this.state.text }),
            React.createElement("div", { className: InputMentionStyles_1.styles.optionsBox, style: {
                    display: this.state.showOptions ? "block" : "none",
                    left: this.state.optionPosition.left + "px",
                    top: this.state.optionPosition.top + "px",
                } },
                this.props.showSearchBar &&
                    React.createElement("div", { className: InputMentionStyles_1.styles.searchBar },
                        "Search: ",
                        React.createElement("span", { className: InputMentionStyles_1.styles.searchTerm }, this.state.searchText)),
                this.props.list
                    .filter(this.filterCondition)
                    .filter(function (item, key) { return key < (_this.props.maxSize || 10); })
                    .map(function (item, key) { return (React.createElement("div", { key: key, className: InputMentionStyles_1.styles.optionItem, style: { backgroundColor: (key === _this.state.currentOptionIndex ? "#dedede" : "white") }, onClick: _this.onItemClick(key), onMouseEnter: _this.onItemMouseEnter(key) },
                    React.createElement("img", { src: item.imageUrl, className: InputMentionStyles_1.styles.optionImage }),
                    item.text,
                    React.createElement("span", { className: InputMentionStyles_1.styles.optionMentionTag },
                        "(@",
                        item.mentionTag,
                        ")"))); }))));
    };
    InputMention.prototype.getInitState = function () {
        return {
            currentOptionIndex: 0,
            optionPosition: {
                left: 100,
                top: 100
            },
            savedSelectionEnd: 0,
            searchText: "",
            showOptions: false,
            startsFrom: 0,
            text: "",
        };
    };
    InputMention.prototype.setThisBindings = function () {
        this.onTextChange = this.onTextChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.filterCondition = this.filterCondition.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onItemMouseEnter = this.onItemMouseEnter.bind(this);
        this.onTextClick = this.onTextClick.bind(this);
    };
    InputMention.prototype.onTextChange = function (event) {
        this.setState({
            text: event.target.value
        });
    };
    InputMention.prototype.onKeyDown = function (event) {
        if (!this.state.showOptions) {
            return;
        }
        if (this.isEnter(event)) {
            this.handleEnter(event);
        }
        else if (this.isEscape(event)) {
            this.handleEscape(event);
        }
        else if (this.isUp(event)) {
            this.handleUp(event);
        }
        else if (this.isDown(event)) {
            this.handleDown(event);
        }
    };
    InputMention.prototype.onKeyUp = function (event) {
        var _this = this;
        var stateChanges = {};
        if (this.state.showOptions) {
            if (this.state.startsFrom > event.target.selectionStart || this.state.text.substring(this.state.startsFrom, event.target.selectionEnd).match(/[\n\r\s]+/)) {
                stateChanges.showOptions = false;
                stateChanges.searchText = "";
            }
            else {
                stateChanges.searchText = this.state.text.substring(this.state.startsFrom, event.target.selectionEnd);
            }
        }
        if (this.isTriggeredByAt(event)) {
            var coords = getCaretCoordinates(event.target, event.target.selectionEnd, {});
            stateChanges = __assign({}, stateChanges, { optionPosition: {
                    left: coords.left,
                    top: coords.top + 20
                }, showOptions: true, startsFrom: event.target.selectionStart });
        }
        stateChanges.savedSelectionEnd = event.target.selectionEnd;
        this.setState(stateChanges, function () {
            if (_this.state.showOptions && !_this.filterCondition(_this.props.list[_this.state.currentOptionIndex])) {
                _this.setState({ currentOptionIndex: _this.getNextItemIndex(-1) });
            }
        });
    };
    InputMention.prototype.onTextClick = function (event) {
        this.onKeyUp(event);
    };
    InputMention.prototype.onItemClick = function (index) {
        var _this = this;
        return (function (event) {
            _this.setState({
                showOptions: false,
                text: _this.insertMentionToText({ target: { selectionEnd: _this.state.savedSelectionEnd } }, index)
            });
            if (_this.refTextArea.current) {
                _this.refTextArea.current.focus();
            }
        });
    };
    InputMention.prototype.onItemMouseEnter = function (index) {
        var _this = this;
        return (function (event) {
            _this.setState({
                currentOptionIndex: index
            });
        });
    };
    InputMention.prototype.isDown = function (event) {
        return event.which === 40;
    };
    InputMention.prototype.isUp = function (event) {
        return event.which === 38;
    };
    InputMention.prototype.isEscape = function (event) {
        return event.which === 27;
    };
    InputMention.prototype.isEnter = function (event) {
        return event.which === 13;
    };
    InputMention.prototype.handleDown = function (event) {
        var _this = this;
        this.setState(function (state) { return ({ currentOptionIndex: _this.getNextItemIndex(state.currentOptionIndex) }); });
        event.preventDefault();
    };
    InputMention.prototype.handleUp = function (event) {
        var _this = this;
        this.setState(function (state) { return ({ currentOptionIndex: _this.getPrevItemIndex(state.currentOptionIndex) }); });
        event.preventDefault();
    };
    InputMention.prototype.handleEscape = function (event) {
        this.setState({ showOptions: false, searchText: "" });
        event.preventDefault();
    };
    InputMention.prototype.handleEnter = function (event) {
        var _this = this;
        var textarea = event.target;
        var insertLength = this.getInsertableMention(event, this.state.currentOptionIndex).length;
        this.setState({
            searchText: "",
            showOptions: false,
            text: this.insertMentionToText(event, this.state.currentOptionIndex)
        }, function () {
            textarea.selectionStart = _this.state.startsFrom + insertLength + 1;
            textarea.selectionEnd = textarea.selectionStart;
        });
        event.preventDefault();
    };
    InputMention.prototype.insertMentionToText = function (event, index) {
        return this.state.text.substring(0, this.state.startsFrom) +
            this.getInsertableMention(event, index) +
            " " +
            this.state.text.substr(event.target.selectionEnd);
    };
    InputMention.prototype.getInsertableMention = function (event, index) {
        return this.isFilteredListHasElements() ?
            this.props.list[index].mentionTag :
            this.state.text.substring(this.state.startsFrom, event.target.selectionEnd);
    };
    InputMention.prototype.isFilteredListHasElements = function () {
        return this.props.list.filter(this.filterCondition).length > 0;
    };
    InputMention.prototype.filterCondition = function (item) {
        return item.text.toLocaleLowerCase().indexOf(this.state.searchText.toLocaleLowerCase()) !== -1
            || item.mentionTag.toLocaleLowerCase().indexOf(this.state.searchText.toLocaleLowerCase()) !== -1;
    };
    InputMention.prototype.getPrevItemIndex = function (index) {
        if (!this.isFilteredListHasElements()) {
            return 0;
        }
        do {
            index--;
            if (index < 0) {
                index = this.props.list.length - 1;
            }
        } while (!this.filterCondition(this.props.list[index]));
        return index;
    };
    InputMention.prototype.getNextItemIndex = function (index) {
        if (!this.isFilteredListHasElements()) {
            return 0;
        }
        do {
            index++;
            if (index >= this.props.list.length) {
                index = 0;
            }
        } while (!this.filterCondition(this.props.list[index]));
        return index;
    };
    InputMention.prototype.isTriggeredByAt = function (event) {
        var charAtSelection = this.state.text.substr(event.target.selectionStart - 1, 1);
        var charBeforeSelection = event.target.selectionStart < 2 ? " " : this.state.text.substr(event.target.selectionStart - 2, 1);
        return charAtSelection === "@" && charBeforeSelection.trim() === "";
    };
    return InputMention;
}(React.Component));
exports.InputMention = InputMention;
//# sourceMappingURL=InputMention.js.map