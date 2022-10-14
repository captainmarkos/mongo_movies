#
# bash aliases and other goodies for mongo movies
#
printf %"s\n" '==> source bash_aliases.sh'

function mdbfind() { find . -iname "$1" -print0 | xargs -0 ls -al; }

alias s='stty sane; echo ""; clear;'
alias l='ls -l'
alias cls='clear'
alias rm='rm -i'
alias mv='mv -i'
alias cp='cp -i'
alias man='man -a'
alias grep='grep -n --color=auto'
alias lh='ls -lt | head -30'
alias h='history'

txtblk='\e[0;30m' # Black - Regular
txtred='\e[0;31m' # Red
txtgrn='\e[0;32m' # Green
txtylw='\e[0;33m' # Yellow
txtblu='\e[0;34m' # Blue
txtpur='\e[0;35m' # Purple
txtcyn='\e[0;36m' # Cyan
txtwht='\e[0;37m' # White

bldblk='\e[1;30m' # Black - Bold
bldred='\e[1;31m' # Red
bldgrn='\e[1;32m' # Green
bldylw='\e[1;33m' # Yellow
bldblu='\e[1;34m' # Blue
bldpur='\e[1;35m' # Purple
bldcyn='\e[1;36m' # Cyan
bldwht='\e[1;37m' # White

bakblk='\e[40m'   # Black - Background
bakred='\e[41m'   # Red
bakgrn='\e[42m'   # Green
bakylw='\e[43m'   # Yellow
bakblu='\e[44m'   # Blue
bakpur='\e[45m'   # Purple
bakcyn='\e[46m'   # Cyan
bakwht='\e[47m'   # White
txtrst='\e[0m'    # Text Reset

# set prompt
# export PS1="\[$bldred\]`hostname`: \[$bldgrn\]\$PWD\[$bldred\]> \[$txtrst\]"
export PS1="\[$bldred\][\u]: \[$bldgrn\]\$PWD\[$bldred\]> \[$txtrst\]"

# set node version
SRC_DIR="/Users/mark.brettin/local/src/mongo_movies";
cd $SRC_DIR;
nvm use;

function rnr_node() {
    # rebuild and run docker container

    #SRC_DIR="/Users/mdb/local/src/mongo_movies"

    echo "==> cd $SRC_DIR/node";
    cd $SRC_DIR/node;

    echo "==> docker stop mdb-node-www";
    docker stop mdb-node-www;

    echo "==> docker rm mdb-node-www";
    docker rm mdb-node-www;

    echo "==> docker rmi -f mdb-node-www";
    docker rmi -f mdb-node-www;

    echo "==> docker build -t mdb-node-www .";
    docker build -t mdb-node-www .;

    printf %"s\n" "==> docker run --detach -p 80:80" \
                  "               --name mdb-node-www" \
                  "               -v $SRC_DIR/node/lib:/app/lib mdb-node-www";

    docker run --detach -p 80:80 \
               --name mdb-node-www mdb-node-www \
               #-v $SRC_DIR/node/lib:/app/lib
}

function rnr_mongo() {
    # rebuild and run docker container

    #SRC_DIR="/Users/mdb/local/src/mongo_movies"

    echo "==> cd $SRC_DIR/mongo";
    cd $SRC_DIR/mongo;

    echo "==> docker stop mdb-mongo";
    docker stop mdb-mongo;

    echo "==> docker rm mdb-mongo";
    docker rm mdb-mongo;

    echo "==> docker rmi -f mdb-mongo";
    docker rmi -f mdb-mongo;

    echo "==> docker build -t mdb-mongo .";
    docker build -t mdb-mongo .;

    printf %"s\n" "==> docker run --detach -p 27017:27017" \
                  "               --name mdb-mongo mdb-mongo" \
               #   "               -v $SRC_DIR/mongo/tmp/mongo_movies:/data/db";
    docker run --detach -p 27017:27017 \
               --name mdb-mongo mdb-mongo \
               #-v $SRC_DIR/mongo/tmp/mongo_movies:/data/db
}

function rnr_graphql() {
    #SRC_DIR="/Users/mdb/local/src/mongo_movies"

    echo "==> cd $SRC_DIR/graphql";
    cd $SRC_DIR/graphql;

    echo "==> docker stop mdb-graphql";
    docker stop mdb-graphql;

    echo "==> docker rm mdb-graphql";
    docker rm mdb-graphql;

    echo "==> docker rmi -f mdb-graphql";
    docker rmi -f mdb-graphql;

    echo "==> docker build -t mdb-graphql .";
    docker build -t mdb-graphql .;

    printf %"s\n" "==> docker run --detach -p 4000:4000 " \
                  "               --name mdb-graphql mdb-graphql" \
               #   "               -v $SRC_DIR/graphql/lib:/app/lib ";
    docker run --detach -p 4000:4000 \
               --name mdb-graphql mdb-graphql \
               #-v $SRC_DIR/graphql/lib:/app/lib;
}


function run_node_shell() {
  printf %"s\n" "==> docker exec -it mdb-node-www bash"
  docker exec -it mdb-node-www bash
}

function run_mongo_shell() {
  printf %"s\n" "==> docker exec -it mdb-mongo bash"
  docker exec -it mdb-mongo bash
}

function run_graphql_shell() {
  printf %"s\n" "==> docker exec -it mdb-graphql bash"
  docker exec -it mdb-graphql bash
}
