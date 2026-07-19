// C++ - Super fast feed ranking
#include <iostream>
#include <vector>
#include <algorithm>
struct Post { int id; int likes; double score; };
int main() {
    std::vector<Post> feed = {{1, 120, 0.9}, {2, 50, 0.95}};
    std::sort(feed.begin(), feed.end(),
      [](auto &a, auto &b){ return a.score > b.score; });
    std::cout << "Bluecamo feed ranked with C++" << std::endl;
    return 0;
}
