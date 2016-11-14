$(function(){
  var searchPubchem = [
    { name: '1-NITROPYRENE', canonicalsmiles: 'C1=CC2=C3C(=C1)C=CC4=C(C=CC(=C43)C=C2)[N+](=O)[O-]', value: '21694' },
    { name: 'nitroglycerin', canonicalsmiles: 'C(C(CO[N+](=O)[O-])O[N+](=O)[O-])O[N+](=O)[O-]', value: '4510' },
    { name: 'Raphisiderite', canonicalsmiles: '[O-2].[O-2].[O-2].[Fe+3].[Fe+3]', value: '14833' },
    { name: 'sodium chloride', canonicalsmiles: '[Na+].[Cl-]', value: '5234' },
    { name: 'ARGON', canonicalsmiles: '[Ar]', value: '23968' },
  ];

  var searchSmiles = [
    { name: '1-NITROPYRENE', value: 'C1=CC2=C3C(=C1)C=CC4=C(C=CC(=C43)C=C2)[N+](=O)[O-]', pubchemid: '21694' },
    { name: 'nitroglycerin', value: 'C(C(CO[N+](=O)[O-])O[N+](=O)[O-])O[N+](=O)[O-]', pubchemid: '4510' },
    { name: 'Raphisiderite', value: '[O-2].[O-2].[O-2].[Fe+3].[Fe+3]', pubchemid: '14833' },
    { name: 'sodium chloride', value: '[Na+].[Cl-]', pubchemid: '5234' },
    { name: 'ARGON', value: '[Ar]', pubchemid: '23968' },
  ];


  var searchData = {arr: searchSmiles};
  initAuto();
  
  // change autocomplete search box placeholder based on radio button
  $('input[type="radio"]').change(function() {
    var elemId = $(this).attr('id');
    var searchType = $('label[for="' + elemId + '"]').text();
    $('#autocomplete').attr('placeholder','Search by ' + searchType);
    searchData.arr = ($(this).val() === 'pubchem-id') ? searchPubchem : searchSmiles;
    initAuto();
    $('#autocomplete').val('');
    $('#autocomplete').focus();
  });

  // autocomplete stuff
  function initAuto() {
    $('#autocomplete').autocomplete({
      lookup: searchData.arr,
      onSelect: function(suggestion) {
        // some function here
        console.log(suggestion.name);
        var chem = newChemical(suggestion.name);
        moveElement(chem, fullSizeShape*(availChems.length-1)+10,0);
      },
      formatResult: function(suggestion, currentValue) {
        return suggestion.name + ' ' + suggestion.value;
      }
    });
  }
});
