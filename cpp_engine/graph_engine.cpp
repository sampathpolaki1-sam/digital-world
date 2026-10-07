#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <sstream>
#include <limits>
#include <algorithm>

using namespace std;

string escapeJsonString(const string& input) {
    string output;
    for (char c : input) {
        if (c == '"') output += "\\\"";
        else if (c == '\\') output += "\\\\";
        else output += c;
    }
    return output;
}

struct Edge {
    string to;
    int weight;
};

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "{\"error\": \"Missing arguments. Expected: edges, source, target\"}" << endl;
        return 1;
    }

    string edges_str = argv[1];
    string source = argv[2];
    string target = argv[3];

    unordered_map<string, vector<Edge>> adjList;
    unordered_map<string, int> degrees;

    stringstream ss(edges_str);
    string token;
    while (getline(ss, token, ',')) {
        size_t start = token.find_first_not_of(" \t");
        size_t end = token.find_last_not_of(" \t");
        if (start == string::npos) continue;
        
        string edge = token.substr(start, end - start + 1);
        size_t dash = edge.find('-');
        if (dash != string::npos) {
            string u = edge.substr(0, dash);
            string remainder = edge.substr(dash + 1);
            
            size_t colon = remainder.find(':');
            string v = remainder;
            int weight = 1;
            
            if (colon != string::npos) {
                v = remainder.substr(0, colon);
                try {
                    weight = stoi(remainder.substr(colon + 1));
                } catch (...) {
                    weight = 1;
                }
            }
            
            u.erase(0, u.find_first_not_of(" \t")); u.erase(u.find_last_not_of(" \t") + 1);
            v.erase(0, v.find_first_not_of(" \t")); v.erase(v.find_last_not_of(" \t") + 1);

            if (!u.empty() && !v.empty()) {
                adjList[u].push_back({v, weight});
                adjList[v].push_back({u, weight});
                degrees[u]++;
                degrees[v]++;
            }
        }
    }

    cout << "{";
    cout << "\"degrees\": {";
    bool first = true;
    for (auto const& [node, deg] : degrees) {
        if (!first) cout << ",";
        cout << "\"" << escapeJsonString(node) << "\": " << deg;
        first = false;
    }
    cout << "},";

    if (adjList.find(source) == adjList.end() || adjList.find(target) == adjList.end()) {
        cout << "\"path\": null, \"distance\": -1, \"error\": \"Source or Target node not found.\"}";
        return 0;
    }

    unordered_map<string, int> dist;
    unordered_map<string, string> parent;
    for (auto const& [node, edges] : adjList) {
        dist[node] = numeric_limits<int>::max();
        parent[node] = "";
    }

    dist[source] = 0;
    
    // Priority queue: stores {distance, node}
    auto cmp = [](pair<int, string> left, pair<int, string> right) { return left.first > right.first; };
    priority_queue<pair<int, string>, vector<pair<int, string>>, decltype(cmp)> pq(cmp);
    
    pq.push({0, source});

    while (!pq.empty()) {
        int d = pq.top().first;
        string u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;
        if (u == target) break;

        for (const auto& edge : adjList[u]) {
            int alt = dist[u] + edge.weight;
            if (alt < dist[edge.to]) {
                dist[edge.to] = alt;
                parent[edge.to] = u;
                pq.push({alt, edge.to});
            }
        }
    }

    if (dist[target] == numeric_limits<int>::max()) {
        cout << "\"path\": null, \"distance\": -1, \"error\": \"No path found.\"}";
    } else {
        vector<string> path;
        string curr = target;
        while (!curr.empty()) {
            path.push_back(curr);
            curr = parent[curr];
        }
        
        cout << "\"path\": \"";
        for (int i = path.size() - 1; i >= 0; --i) {
            cout << escapeJsonString(path[i]);
            if (i > 0) cout << " -> ";
        }
        cout << "\", \"distance\": " << dist[target] << "}";
    }

    return 0;
}
