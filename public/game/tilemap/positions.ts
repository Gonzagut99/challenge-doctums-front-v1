interface Position {
    x: number;
    y: number;
    id: number;
    type?: string;
}

export const changeDirection: Position[] = [
    //Los ids mayor a 360 son solisiones transparentes para el cambio de direccion
    { x: 430, y: 5770, id: 366 },
    { x: 560, y: 4380, id: 367 },
    { x: 880, y: 2600, id: 368 },
    { x: 870-190, y: 1220, id: 370 },
    { x: 420, y: 5570, type: "level-2", id: 31 },//febrero
    { x: 500, y: 5290, type: "level-1", id: 60 },//febrero
    { x: 500 - 10, y: 5130, type: "level-2", id: 61 },
    { x: 580 - 10, y: 4860, type: "rest", id: 90 },
    { x: 560, y: 4660, type: "rest", id: 91 },
    { x: 560, y: 4240, type: "level-3", id: 121 },
    { x: 630, y: 3960, type: "level-4", id: 150 },//abril
    { x: 690, y: 3510, type: "level-3", id: 180 },//junio
    { x: 1010, y: 1710, type: "rest", id: 300 },
    
    { x: 950, y: 2160, type: "level-3", id: 270 },//septiembre
    { x: 690, y: 3330, type: "rest", id: 181 },
    { x: 750-70, y: 1100, type: "level-5", id: 331 },
    

];
export const sameDirection : Position[]  = [
    { x: 690, y: 3330, type: "rest", id: 181 },//julio
    { x: 1010, y:1560, id: 369 },
    

    

];

export const dayPositions : Position[] = [
    { x: 210, y: 6070, type: "level-3", id: 1 },
    { x: 290, y: 6070, type: "level-3", id: 2 },
    { x: 370, y: 6070, type: "level-3", id: 3 },
    { x: 450, y: 6070, type: "level-3", id: 4 },
    { x: 530, y: 6070, type: "level-3", id: 5 },
    { x: 610, y: 6070, type: "rest", id: 6 },
    { x: 690, y: 6070, type: "rest", id: 7 },
    { x: 690, y: 5990, type: "level-3", id: 8 },
    { x: 610, y: 5990, type: "level-2", id: 9 },
    { x: 530, y: 5990, type: "level-2", id: 10 },
    { x: 450, y: 5990, type: "level-2", id: 11 },
    { x: 370, y: 5990, type: "level-2", id: 12 },
    { x: 290, y: 5990, type: "rest", id: 13 },
    { x: 210, y: 5990, type: "rest", id: 14 },
    { x: 210, y: 5910, type: "level-2", id: 15 },
    { x: 290, y: 5910, type: "level-2", id: 16 },
    { x: 370, y: 5910, type: "level-2", id: 17 },
    { x: 450, y: 5910, type: "level-2", id: 18 },
    { x: 530, y: 5910, type: "level-3", id: 19 },
    { x: 610, y: 5910, type: "rest", id: 20 },
    { x: 690, y: 5910, type: "rest", id: 21 },
    { x: 690, y: 5840, type: "level-1", id: 22 },
    { x: 610, y: 5840, type: "level-1", id: 23 },
    { x: 530, y: 5840, type: "level-1", id: 24 },
    { x: 450, y: 5840, type: "level-1", id: 25 },
    { x: 370, y: 5840, type: "level-1", id: 26 },
    { x: 290, y: 5840, type: "rest", id: 27 },
    { x: 210, y: 5840, type: "rest", id: 28 },
    { x: 210, y: 5770, type: "level-2", id: 29 },
    { x: 290, y: 5770, type: "level-2", id: 30 },
    // February
    { x: 420, y: 5570, type: "level-2", id: 31 },
    { x: 500, y: 5570, type: "level-2", id: 32 },
    { x: 580, y: 5570, type: "level-3", id: 33 },
    { x: 660, y: 5570, type: "rest", id: 34 },
    { x: 740, y: 5570, type: "rest", id: 35 },
    { x: 740, y: 5500, type: "level-3", id: 36 },
    { x: 660, y: 5500, type: "level-3", id: 37 },
    { x: 580, y: 5500, type: "level-3", id: 38 },
    { x: 500, y: 5500, type: "level-3", id: 39 },
    { x: 420, y: 5500, type: "level-3", id: 40 },
    { x: 350, y: 5500, type: "rest", id: 41 },
    { x: 280, y: 5500, type: "rest", id: 42 },
    { x: 280, y: 5430, type: "level-2", id: 43 },
    { x: 350, y: 5430, type: "level-2", id: 44 },
    { x: 420, y: 5430, type: "level-2", id: 45 },
    { x: 500, y: 5430, type: "level-2", id: 46 },
    { x: 580, y: 5430, type: "level-2", id: 47 },
    { x: 660, y: 5430, type: "rest", id: 48 },
    { x: 740, y: 5430, type: "rest", id: 49 },
    { x: 740, y: 5360, type: "level-2", id: 50 },
    { x: 660, y: 5360, type: "level-1", id: 51 },
    { x: 580, y: 5360, type: "level-1", id: 52 },
    { x: 500, y: 5360, type: "level-1", id: 53 },
    { x: 420, y: 5360, type: "level-1", id: 54 },
    { x: 350, y: 5360, type: "rest", id: 55 },
    { x: 280, y: 5360, type: "rest", id: 56 },
    { x: 280, y: 5290, type: "level-2", id: 57 },
    { x: 350, y: 5290, type: "level-2", id: 58 },
    { x: 420, y: 5290, type: "level-1", id: 59 },
    { x: 500, y: 5290, type: "level-1", id: 60 },
    //March
    { x: 500 - 10, y: 5130, type: "level-2", id: 61 },
    { x: 580 - 10, y: 5130, type: "rest", id: 62 },
    { x: 660 - 10, y: 5130, type: "rest", id: 63 },
    { x: 660 - 10, y: 5060, type: "level-2", id: 64 },
    { x: 580 - 10, y: 5060, type: "level-2", id: 65 },
    { x: 500 - 10, y: 5060, type: "level-2", id: 66 },
    { x: 420 - 10, y: 5060, type: "level-3", id: 67 },
    { x: 350 - 10, y: 5060, type: "level-3", id: 68 },
    { x: 280 - 10, y: 5060, type: "rest", id: 69 },
    { x: 200, y: 5060, type: "rest", id: 70 },
    { x: 200, y: 4990, type: "level-3", id: 71 },
    { x: 350 - 10, y: 4990, type: "level-3", id: 72 },
    { x: 270, y: 4990, type: "level-3", id: 73 },
    { x: 420 - 10, y: 4990, type: "level-3", id: 74 },
    { x: 500 - 10, y: 4990, type: "level-2", id: 75 },
    { x: 570, y: 4990, type: "rest", id: 76 },
    { x: 650, y: 4990, type: "rest", id: 77 },
    { x: 660 - 10, y: 4920, type: "level-2", id: 78 },
    { x: 500 - 10, y: 4920, type: "level-2", id: 79 },
    { x: 580 - 10, y: 4920, type: "level-2", id: 80 },
    { x: 410, y: 4920, type: "level-2", id: 82 },
    { x: 340, y: 4920, type: "level-2", id: 83 },
    { x: 270, y: 4920, type: "rest", id: 83 },
    { x: 200, y: 4920, type: "rest", id: 84 },
    { x: 200, y: 4860, type: "level-1", id: 85 },
    { x: 280 - 10, y: 4860, type: "level-1", id: 86 },
    { x: 350 - 10, y: 4860, type: "level-1", id: 87 },
    { x: 420 - 10, y: 4860, type: "level-1", id: 88 },
    { x: 500 - 10, y: 4860, type: "level-1", id: 89 },
    { x: 580 - 10, y: 4860, type: "rest", id: 90 },
    //April
    { x: 560, y: 4660, type: "rest", id: 91 },
    { x: 630, y: 4660, type: "level-1", id: 92 },
    { x: 700, y: 4660, type: "level-2", id: 93 },
    { x: 770, y: 4660, type: "level-2", id: 94 },
    { x: 840, y: 4660, type: "level-2", id: 95 },
    { x: 910, y: 4660, type: "level-2", id: 96 },
    { x: 980, y: 4660, type: "rest", id: 97 },
    { x: 1050, y: 4660, type: "rest", id: 98 },
    { x: 1050, y: 4590, type: "level-2", id: 99 },
    { x: 980, y: 4590, type: "level-2", id: 100 },
    { x: 910, y: 4590, type: "level-3", id: 101 },
    { x: 840, y: 4590, type: "level-3", id: 102 },
    { x: 770, y: 4590, type: "level-2", id: 103 },
    { x: 700, y: 4590, type: "rest", id: 104 },
    { x: 630, y: 4590, type: "rest", id: 105 },
    { x: 630, y: 4520, type: "level-3", id: 106 },
    { x: 700, y: 4520, type: "level-3", id: 107 },
    { x: 770, y: 4520, type: "level-3", id: 108 },
    { x: 840, y: 4520, type: "level-4", id: 109 },
    { x: 910, y: 4520, type: "level-4", id: 110 },
    { x: 980, y: 4520, type: "rest", id: 111 },
    { x: 1050, y: 4520, type: "rest", id: 112 },
    { x: 1050, y: 4450, type: "level-2", id: 113 },
    { x: 980, y: 4450, type: "level-3", id: 114 },
    { x: 910, y: 4450, type: "level-3", id: 115 },
    { x: 840, y: 4450, type: "level-3", id: 116 },
    { x: 770, y: 4450, type: "level-2", id: 117 },
    { x: 700, y: 4450, type: "rest", id: 118 },
    { x: 630, y: 4450, type: "rest", id: 119 },
    { x: 630, y: 4380, type: "level-1", id: 120 },
    // May
    { x: 560, y: 4240, type: "level-3", id: 121 },
    { x: 630, y: 4240, type: "level-3", id: 122 },
    { x: 700, y: 4240, type: "level-3", id: 123 },
    { x: 770, y: 4240, type: "level-3", id: 124 },
    { x: 840, y: 4240, type: "rest", id: 125 },
    { x: 910, y: 4240, type: "rest", id: 126 },
    { x: 910, y: 4170, type: "level-2", id: 127 },
    { x: 840, y: 4170, type: "level-2", id: 128 },
    { x: 770, y: 4170, type: "level-2", id: 129 },
    { x: 700, y: 4170, type: "level-2", id: 130 },
    { x: 630, y: 4170, type: "level-2", id: 131 },
    { x: 560, y: 4170, type: "rest", id: 132 },
    { x: 490, y: 4170, type: "rest", id: 133 },
    { x: 490, y: 4100, type: "level-2", id: 134 },
    { x: 560, y: 4100, type: "level-3", id: 135 },
    { x: 630, y: 4100, type: "level-3", id: 136 },
    { x: 700, y: 4100, type: "level-3", id: 137 },
    { x: 770, y: 4100, type: "level-3", id: 138 },
    { x: 840, y: 4100, type: "rest", id: 139 },
    { x: 910, y: 4100, type: "rest", id: 140 },
    { x: 910, y: 4030, type: "level-3", id: 141 },
    { x: 840, y: 4030, type: "level-3", id: 142 },
    { x: 770, y: 4030, type: "level-4", id: 143 },
    { x: 700, y: 4030, type: "level-4", id: 144 },
    { x: 630, y: 4030, type: "level-4", id: 145 },
    { x: 560, y: 4030, type: "rest", id: 146 },
    { x: 490, y: 4030, type: "rest", id: 147 },
    { x: 490, y: 3960, type: "level-4", id: 148 },
    { x: 560, y: 3960, type: "level-4", id: 149 },
    { x: 630, y: 3960, type: "level-4", id: 150 },
    //June
    { x: 620, y: 3790, type: "level-3", id: 151 },
    { x: 690, y: 3790, type: "level-3", id: 152 },
    { x: 760, y: 3790, type: "rest", id: 153 },
    { x: 830, y: 3790, type: "rest", id: 154 },
    { x: 830, y: 3720, type: "level-3", id: 155 },
    { x: 760, y: 3720, type: "level-3", id: 156 },
    { x: 690, y: 3720, type: "level-3", id: 157 },
    { x: 620, y: 3720, type: "level-3", id: 158 },
    { x: 550, y: 3720, type: "level-3", id: 159 },
    { x: 480, y: 3720, type: "rest", id: 160 },
    { x: 410, y: 3720, type: "rest", id: 161 },
    { x: 410, y: 3650, type: "level-3", id: 162 },
    { x: 480, y: 3650, type: "level-3", id: 163 },
    { x: 550, y: 3650, type: "level-3", id: 164 },
    { x: 620, y: 3650, type: "level-3", id: 165 },
    { x: 690, y: 3650, type: "level-3", id: 166 },
    { x: 760, y: 3650, type: "rest", id: 167 },
    { x: 830, y: 3650, type: "rest", id: 168 },
    { x: 830, y: 3580, type: "level-3", id: 169 },
    { x: 760, y: 3580, type: "level-3", id: 170 },
    { x: 690, y: 3580, type: "level-3", id: 171 },
    { x: 620, y: 3580, type: "level-3", id: 172 },
    { x: 550, y: 3580, type: "level-3", id: 173 },
    { x: 480, y: 3580, type: "rest", id: 174 },
    { x: 410, y: 3580, type: "rest", id: 175 },
    { x: 410, y: 3510, type: "level-3", id: 176 },
    { x: 480, y: 3510, type: "level-3", id: 177 },
    { x: 550, y: 3510, type: "level-3", id: 178 },
    { x: 620, y: 3510, type: "level-3", id: 179 },
    { x: 690, y: 3510, type: "level-3", id: 180 },
    //July
    { x: 690, y: 3330, type: "rest", id: 181 },
    { x: 620, y: 3330, type: "rest", id: 182 },
    { x: 620, y: 3270, type: "level-3", id: 183 },
    { x: 690, y: 3270, type: "level-3", id: 184 },
    { x: 760, y: 3270, type: "level-3", id: 185 },
    { x: 830, y: 3270, type: "level-3", id: 186 },
    { x: 900, y: 3270, type: "level-3", id: 187 },
    { x: 970, y: 3270, type: "rest", id: 188 },
    { x: 1040, y: 3270, type: "rest", id: 189 },
    { x: 1040, y: 3200, type: "level-3", id: 190 },
    { x: 970, y: 3200, type: "level-4", id: 191 },
    { x: 900, y: 3200, type: "level-4", id: 192 },
    { x: 830, y: 3200, type: "level-4", id: 193 },
    { x: 760, y: 3200, type: "level-4", id: 194 },
    { x: 690, y: 3200, type: "rest", id: 195 },
    { x: 620, y: 3200, type: "rest", id: 196 },
    { x: 620, y: 3130, type: "level-4", id: 197 },
    { x: 690, y: 3130, type: "level-4", id: 198 },
    { x: 760, y: 3130, type: "level-5", id: 199 },
    { x: 830, y: 3130, type: "level-5", id: 200 },
    { x: 900, y: 3130, type: "level-5", id: 201 },
    { x: 970, y: 3130, type: "rest", id: 202 },
    { x: 1040, y: 3130, type: "rest", id: 203 },
    { x: 1040, y: 3060, type: "level-5", id: 204 },
    { x: 970, y: 3060, type: "level-5", id: 205 },
    { x: 900, y: 3060, type: "level-5", id: 206 },
    { x: 830, y: 3060, type: "level-4", id: 207 },
    { x: 760, y: 3060, type: "level-4", id: 208 },
    { x: 690, y: 3060, type: "rest", id: 209 },
    { x: 620, y: 3060, type: "rest", id: 210 },
    //August
    { x: 620, y: 2880, type: "level-3", id: 211 },
    { x: 690, y: 2880, type: "level-3", id: 212 },
    { x: 760, y: 2880, type: "level-3", id: 213 },
    { x: 830, y: 2880, type: "level-3", id: 214 },
    { x: 900, y: 2880, type: "level-3", id: 215 },
    { x: 970, y: 2880, type: "rest", id: 216 },
    { x: 1040, y: 2880, type: "rest", id: 217 },
    { x: 1040, y: 2810, type: "level-3", id: 218 },
    { x: 970, y: 2810, type: "level-3", id: 219 },
    { x: 900, y: 2810, type: "level-3", id: 220 },
    { x: 830, y: 2810, type: "level-3", id: 221 },
    { x: 760, y: 2810, type: "level-3", id: 222 },
    { x: 690, y: 2810, type: "rest", id: 223 },
    { x: 620, y: 2810, type: "rest", id: 224 },
    { x: 620, y: 2740, type: "level-3", id: 225 },
    { x: 690, y: 2740, type: "level-3", id: 226 },
    { x: 760, y: 2740, type: "level-3", id: 227 },
    { x: 830, y: 2740, type: "level-3", id: 228 },
    { x: 900, y: 2740, type: "level-3", id: 229 },
    { x: 970, y: 2740, type: "rest", id: 230 },
    { x: 1040, y: 2740, type: "rest", id: 231 },
    { x: 1040, y: 2670, type: "level-3", id: 232 },
    { x: 970, y: 2670, type: "level-3", id: 233 },
    { x: 900, y: 2670, type: "level-3", id: 234 },
    { x: 830, y: 2670, type: "level-3", id: 235 },
    { x: 760, y: 2670, type: "level-3", id: 236 },
    { x: 690, y: 2670, type: "rest", id: 237 },
    { x: 620, y: 2670, type: "rest", id: 238 },
    { x: 620, y: 2600, type: "level-3", id: 239 },
    { x: 690, y: 2600, type: "level-3", id: 240 },
    // September
    { x: 880, y: 2440, type: "level-3", id: 241 },
    { x: 950, y: 2440, type: "level-3", id: 242 },
    { x: 1030, y: 2440, type: "level-3", id: 243 },
    { x: 1100, y: 2440, type: "rest", id: 244 },
    { x: 1170, y: 2440, type: "rest", id: 245 },
    { x: 1170, y: 2370, type: "level-3", id: 246 },
    { x: 1100, y: 2370, type: "level-3", id: 247 },
    { x: 1030, y: 2370, type: "level-3", id: 248 },
    { x: 950, y: 2370, type: "level-3", id: 249 },
    { x: 880, y: 2370, type: "level-3", id: 250 },
    { x: 810, y: 2370, type: "rest", id: 251 },
    { x: 740, y: 2370, type: "rest", id: 252 },
    { x: 740, y: 2300, type: "level-3", id: 253 },
    { x: 810, y: 2300, type: "level-3", id: 254 },
    { x: 880, y: 2300, type: "level-3", id: 255 },
    { x: 950, y: 2300, type: "level-3", id: 256 },
    { x: 1030, y: 2300, type: "level-3", id: 257 },
    { x: 1100, y: 2300, type: "rest", id: 258 },
    { x: 1170, y: 2300, type: "rest", id: 259 },
    { x: 1170, y: 2230, type: "level-3", id: 260 },
    { x: 1100, y: 2230, type: "level-3", id: 261 },
    { x: 1030, y: 2230, type: "level-3", id: 262 },
    { x: 950, y: 2230, type: "level-3", id: 263 },
    { x: 880, y: 2230, type: "level-3", id: 264 },
    { x: 810, y: 2230, type: "rest", id: 265 },
    { x: 740, y: 2230, type: "rest", id: 266 },
    { x: 740, y: 2160, type: "level-3", id: 267 },
    { x: 810, y: 2160, type: "level-3", id: 268 },
    { x: 880, y: 2160, type: "level-3", id: 269 },
    { x: 950, y: 2160, type: "level-3", id: 270 },
    //Octuber
    { x: 940, y: 1990, type: "level-6", id: 271 },
    { x: 1010, y: 1990, type: "rest", id: 272 },
    { x: 1080, y: 1990, type: "rest", id: 273 },
    { x: 1080, y: 1920, type: "level-6", id: 274 },
    { x: 1010, y: 1920, type: "level-6", id: 275 },
    { x: 940, y: 1920, type: "level-6", id: 276 },
    { x: 870, y: 1920, type: "level-5", id: 277 },
    { x: 800, y: 1920, type: "level-5", id: 278 },
    { x: 730, y: 1920, type: "rest", id: 279 },
    { x: 660, y: 1920, type: "rest", id: 280 },
    { x: 660, y: 1850, type: "level-5", id: 281 },
    { x: 730, y: 1850, type: "level-5", id: 282 },
    { x: 800, y: 1850, type: "level-5", id: 283 },
    { x: 870, y: 1850, type: "level-5", id: 284 },
    { x: 940, y: 1850, type: "level-5", id: 285 },
    { x: 1010, y: 1850, type: "rest", id: 286 },
    { x: 1080, y: 1850, type: "rest", id: 287 },
    { x: 1080, y: 1780, type: "level-5", id: 288 },
    { x: 1010, y: 1780, type: "level-5", id: 289 },
    { x: 940, y: 1780, type: "level-5", id: 290 },
    { x: 870, y: 1780, type: "level-5", id: 291 },
    { x: 800, y: 1780, type: "level-5", id: 292 },
    { x: 730, y: 1780, type: "rest", id: 293 },
    { x: 660, y: 1780, type: "rest", id: 294 },
    { x: 660, y: 1710, type: "level-5", id: 295 },
    { x: 730, y: 1710, type: "level-5", id: 296 },
    { x: 800, y: 1710, type: "level-5", id: 297 },
    { x: 870, y: 1710, type: "level-5", id: 298 },
    { x: 940, y: 1710, type: "level-5", id: 299 },
    { x: 1010, y: 1710, type: "rest", id: 300 },
    //November
    { x: 940-190, y: 1540+20, type: "rest", id: 301 },
    { x: 940-190, y: 1470+20, type: "level-3", id: 302 },
    { x: 870-190, y: 1470+20, type: "level-4", id: 303 },
    { x: 800-190, y: 1470+20, type: "level-4", id: 304 },
    { x: 730-190, y: 1470+20, type: "level-4", id: 305 },
    { x: 660-190, y: 1470+20, type: "level-4", id: 306 },
    { x: 590-190, y: 1470+20, type: "rest", id: 307 },
    { x: 520-190, y: 1470+20, type: "rest", id: 308 },
    { x: 520-190, y: 1400+20, type: "level-4", id: 309 },
    { x: 590-190, y: 1400+20, type: "level-4", id: 310 },
    { x: 660-190, y: 1400+20, type: "level-4", id: 311 },
    { x: 730-190, y: 1400+20, type: "level-4", id: 312 },
    { x: 800-190, y: 1400+20, type: "level-4", id: 313 },
    { x: 870-190, y: 1400+20, type: "rest", id: 314 },
    { x: 940-190, y: 1400+20, type: "rest", id: 315 },
    { x: 940-190, y: 1330+20, type: "level-5", id: 316 },
    { x: 870-190, y: 1330+20, type: "level-5", id: 317 },
    { x: 800-190, y: 1330+20, type: "level-5", id: 318 },
    { x: 730-190, y: 1330+20, type: "level-5", id: 319 },
    { x: 660-190, y: 1330+20, type: "level-5", id: 320 },
    { x: 590-190, y: 1330+20, type: "rest", id: 321 },
    { x: 520-190, y: 1330+20, type: "rest", id: 322 },
    { x: 520-190, y: 1260+20, type: "level-5", id: 323 },
    { x: 590-190, y: 1260+20, type: "level-5", id: 324 },
    { x: 660-190, y: 1260+20, type: "level-5", id: 325 },
    { x: 730-190, y: 1260+20, type: "level-5", id: 326 },
    { x: 800-190, y: 1260+20, type: "level-5", id: 327 },
    { x: 870-190, y: 1260+20, type: "rest", id: 328 },
    { x: 940-190, y: 1260+20, type: "rest", id: 329 },
    { x: 940-190, y: 1220, type: "level-5", id: 330 },
    //December
    { x: 750-70, y: 1100, type: "level-5", id: 331 },
    { x: 820-70, y: 1100, type: "level-5", id: 332 },
    { x: 890-70, y: 1100, type: "level-5", id: 333 },
    { x: 960-70, y: 1100, type: "level-5", id: 334 },
    { x: 1030-70, y: 1100, type: "rest", id: 335 },
    { x: 1100-70, y: 1100, type: "rest", id: 336 },
    { x: 1100-70, y: 1030, type: "level-6", id: 337 },
    { x: 1030-70, y: 1030, type: "level-6", id: 338 },
    { x: 960-70, y: 1030, type: "level-6", id: 339 },
    { x: 890-70, y: 1030, type: "level-6", id: 340 },
    { x: 820-70, y: 1030, type: "level-6", id: 341 },
    { x: 750-70, y: 1030, type: "rest", id: 342 },
    { x: 680-70, y: 1030, type: "rest", id: 343 },

    { x: 680-70, y: 960, type: "level-6", id: 344 },
    { x: 750-70, y: 960, type: "level-5", id: 345 },
    { x: 820-70, y: 960, type: "level-5", id: 346 },
    { x: 890-70, y: 960, type: "level-5", id: 347 },
    { x: 960-70, y: 960, type: "level-5", id: 348 },
    { x: 1030-70, y: 960, type: "rest", id: 349 },
    { x: 1100-70, y: 960, type: "rest", id: 350 },

    { x: 1100-70, y: 900, type: "level-5", id: 351 },
    { x: 1030-70, y: 900, type: "level-5", id: 352 },
    { x: 960-70, y: 900, type: "level-6", id: 353 },
    { x: 890-70, y: 900, type: "level-6", id: 354 },
    { x: 820-70, y: 900, type: "level-6", id: 355 },
    { x: 750-70, y: 900, type: "rest", id: 356 },
    { x: 680-70, y: 900, type: "rest", id: 357 },

    { x: 680-70, y: 840, type: "level-6", id: 358 },
    { x: 750-70, y: 840, type: "level-6", id: 359 },
    { x: 820-70, y: 840, type: "level-6", id: 360 },
   // { x: 890, y: 840, type: "level-6", id: 360 }
];
