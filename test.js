let snapshots = [
  "{'ages': [34.870095344692245], 'genders': ['M'], 'number_of_face': 1, 'timeSnap': 1621914088.5077057}",
  "{'ages': [], 'genders': [], 'number_of_face': 0, 'timeSnap': 1621914117.9362547}",
  "{'ages': [24.683130542268604], 'genders': ['F'], 'number_of_face': 1, 'timeSnap': 1621914147.60609}",
  "{'ages': [], 'genders': [], 'number_of_face': 0, 'timeSnap': 1621914177.8105245}",
  "{'ages': [], 'genders': [], 'number_of_face': 0, 'timeSnap': 1621914207.7746372}",
  "{'ages': [21.09719739128051], 'genders': ['M'], 'number_of_face': 1, 'timeSnap': 1621914237.895455}",
  "{'ages': [22.916949343866374], 'genders': ['M'], 'number_of_face': 1, 'timeSnap': 1621914267.5241158}",
  "{'ages': [23.395767567601663], 'genders': ['M'], 'number_of_face': 1, 'timeSnap': 1621914297.8672068}",
  "{'ages': [36.796304985995], 'genders': ['M'], 'number_of_face': 1, 'timeSnap': 1621914327.525153}",
  "{'ages': [], 'genders': [], 'number_of_face': 0, 'timeSnap': 1621914357.626186}",
  "{'ages': [36.020474051401656], 'genders': ['M'], 'number_of_face': 1, 'timeSnap': 1621914387.7493644}",
  "{'ages': [], 'genders': [], 'number_of_face': 0, 'timeSnap': 1621914417.5659084}",
  "{'ages': [25.25692313551461], 'genders': ['F'], 'number_of_face': 1, 'timeSnap': 1621914447.7216923}",
  "{'ages': [], 'genders': [], 'number_of_face': 0, 'timeSnap': 1621914477.6487122}",
];
// let a = "aaaa";

snapshots.forEach((ele) => {
  ele = ele.split("'").join('"');
  console.log(ele);
});
