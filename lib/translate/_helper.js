"use strict";

module.exports = {
	parsePhonic(phonic, uk, us) {
		if (phonic || uk || us) { // 保证要么只有一个 phonic 要么只有一对 uk + us
			if (uk && us && uk !== us) {
				return {
					us: us,
					uk: uk
				};
			}
			return phonic || uk || us;
		}
		
		return null;
	}
};