var asAction = require('machine-as-action');

const RENDER_PER_DAY = 24936.6;
const EMISSIONS_START_DATE = 'December 20, 2023';
const MILLISECONDS_IN_A_DAY = 86400000;
const DAYS_IN_EPOCH = 7;

module.exports = {


  friendlyName: 'Emissions',


  description: 'RENDER minted as community rewards.',


  totalEmissions: asAction({
    description: 'Total RENDER minted to date',
    exits: {
      success: {
        outputExample: {
          totalEmissions: '200000000',
          change: 4,
          changeType: 'positive'
        }
      },
      serverError: {
        description: 'Something went wrong. We are working to resolve this. Please try again later.',
      }
    },
    fn: function (inputs, exits) {
      const startDate = Date.parse(EMISSIONS_START_DATE);
      const date = new Date().getTime();
      const intervalInDays = (date - startDate) / MILLISECONDS_IN_A_DAY;
      const totalEmissions = intervalInDays * RENDER_PER_DAY;
      const intervalMinusToday = Math.floor(intervalInDays);
      const emissionsUpToToday = intervalMinusToday * RENDER_PER_DAY;
      const change = ((totalEmissions - emissionsUpToToday) / emissionsUpToToday) * 100;
      
      return exits.success({
        totalEmissions,
        change,
        changeType: change > 0 ? 'positive' : 'negative'
      });
    }
  }),


  currentEpochEmissions: asAction({
    description: 'RENDER minted during current epoch',
    exits: {
      success: {
        outputExample: {
          emissions: '123245',
          change: 4,
          changeType: 'positive'
        }
      },
      serverError: {
        description: 'Something went wrong. We are working to resolve this. Please try again later.',
      }
    },
    fn: function(inputs, exits) {
      const startDate = Date.parse(EMISSIONS_START_DATE);
      const date = new Date().getTime();
      const intervalInDays = (date - startDate) / MILLISECONDS_IN_A_DAY;
      const emissions = (intervalInDays % DAYS_IN_EPOCH) * RENDER_PER_DAY;
      const intervalMinusToday = Math.floor(intervalInDays % DAYS_IN_EPOCH);
      const emissionsUpToToday = intervalMinusToday * RENDER_PER_DAY;
      const change = ((emissions - emissionsUpToToday) / emissionsUpToToday) * 100;
      return exits.success({
        emissions,
        change,
        changeType: change > 0 ? 'positive' : 'negative'
      });
    }
  })


};
