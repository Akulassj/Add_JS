

window.applyCustomMask = (element) => {
    const momentFormat = 'YYYY/MM/DD HH:mm';

    const mask = IMask(element, {
        mask: Date,
        pattern: momentFormat,
        lazy: false,
        min: new Date(1970, 0, 1),
        max: new Date(2030, 0, 1),

        format: date => moment(date).format(momentFormat),
        parse: str => moment(str, momentFormat),

        blocks: {
            YYYY: {
                mask: IMask.MaskedRange,
                from: 1970,
                to: 2030
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12
            },
            DD: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31
            },
            HH: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 23
            },
            mm: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 59
            }
        }
    });

    element.addEventListener('focusout', function () {
        const value = moment(mask.value, momentFormat);
        if (value.isValid()) {
            element.value = value.format(momentFormat);
        } else {
            element.value = '';
        }
    });

    
    window.getInputValue = (element) => {
        return element.value;
    };

};


