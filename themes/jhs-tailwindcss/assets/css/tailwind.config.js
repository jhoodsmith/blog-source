module.exports = {
    theme: {
	extend: {
	    typography: {
		DEFAULT: {
		    css: {
			color: '#9CA3AF',
			code: {
			    color: '#E5E7EB',
			    backgroundColor: '#374151',
			    borderRadius: '4px',
			    padding: '2px 3px'
			},
			'code::before': {
			    display: 'none'
			},
			'code::after': {
			    display: 'none'
			},
			a: {
			    color: '#FBBF24',
			    textDecoration: 'none',
			    '&:hover': {
				color: '#FCD34D',
				textDecoration: 'underline',
			    },
			},
			h1: {color: 'white'},
			h2: {color: 'white'},
			h3: {color: 'white'},
			h4: {color: 'white'},
		    },
		},
	    }
	},
    },
    plugins: [
	require('@tailwindcss/typography'),
    ]
}
