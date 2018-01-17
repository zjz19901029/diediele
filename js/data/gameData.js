const data = [ //每关图形初始数据
    {
        items: [
            {
                "width": 4,
                "height": 4,
                "x": 8,
                "y": 2,
                "shape": "triangle",
                "direction": "l-d"
            },
            {
                "width": 4,
                "height": 4,
                "x": 8,
                "y": 2,
                "shape": "triangle",
                "direction": "r-d"
            },
            {
                "width": 4,
                "height": 4,
                "x": 5,
                "y": 7,
                "shape": "triangle",
                "direction": "u"
            },
            {
                "width": 4,
                "height": 4,
                "x": 5,
                "y": 7,
                "shape": "triangle",
                "direction": "l-u"
            },
            {
                "width": 4,
                "height": 4,
                "x": 5,
                "y": 7,
                "shape": "triangle",
                "direction": "r-u"
            }
        ],
        answers: [ //每关答案
            "5|3,5|2,5|1",
            "5|2,5|3,5|1"
        ]
    },
    {
        items: [
            {
                "width": 4,
                "height": 4,
                "x": 3,
                "y": 2,
                "shape": "cube"
            },
            {
                "width": 4,
                "height": 4,
                "x": 8,
                "y": 2,
                "shape": "cube"
            },
            {
                "width": 4,
                "height": 4,
                "x": 5,
                "y": 7,
                "shape": "triangle",
                "direction": "u"
            }
        ],
        answers: [ //每关答案
            "5|3,5|2,5|1",
            "5|2,5|3,5|1"
        ]
    },
    {
        items: [
            {
                "width": 2,
                "height": 2,
                "x": 3,
                "y": 2,
                "shape": "cube"
            },
            {
                "width": 4,
                "height": 4,
                "x": 8,
                "y": 2,
                "shape": "cube"
            },
            {
                "width": 4,
                "height": 4,
                "x": 4,
                "y": 5,
                "shape": "triangle"
            }
        ],
        answers: [ //每关答案
            "6|5,6|5,6|5"
        ]
    }
]
    

export default data