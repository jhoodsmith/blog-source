module.exports = {
    theme: {
	extend: {
	    typography: {
		DEFAULT: {
		    css: {
			color: '#9CA3AF',
			code: {
			    color: 'white',
			    backgroundColor: '#374151',
			    padding: '4px',
			    fontSize: '90%',
			    borderRadius: '4px'
			},
			a: {
			    color: '#FBBF24',
			    textDecoration: 'none',
			    '&:hover': {
				color: '#2c5282',
			    },
			},
			h1: {color: 'white'},
			h2: {color: 'white'},
			h3: {color: 'white'},
		    },
		},
	    }
	},
    },
    plugins: [
	require('@tailwindcss/typography'),
    ]
}
