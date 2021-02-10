user=$1
dry_run=$2
dist_dir=../dist
remote_dir=/var/www/questionnaire

rm -rf $dist_dir
mkdir -p $dist_dir

(cd .. && npm install && cd scripts)

cp -r ../node_modules $dist_dir/node_modules
cp -r ../public $dist_dir/public
cp -r ../data $dist_dir/data
cp ../package-lock.json $dist_dir/package-lock.json
cp ../package.json $dist_dir/package.json
cp ../server.mjs $dist_dir/server.mjs

if [ "$dry_run" = true ]; then
    exit
fi

ssh $user@smirky-games.com "rm -rf $remote_dir"
scp -r $dist_dir $user@smirky-games.com:$remote_dir